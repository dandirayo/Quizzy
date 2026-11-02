import { createContext, useState, useContext, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { getUserProfile, saveUserQuizResult, initLocalDb } from '../services/db';
import { hashPassword, verifyPassword } from '../utils/crypto';
import { safeJsonParse, sanitizeUser } from '../utils/helpers';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const ACTIVE_USER_KEY = 'quizzy_active_user_session';
const LOCAL_USERS_KEY = 'quizzy_db_users';

// Whitelist of valid psychological quiz IDs that can be converted from guest sessions
const VALID_QUIZ_IDS = [
  'mbti',
  'riasec',
  'bigfive',
  'love-style',
  'attachment',
  'work-style',
  'social-battery',
  'enneagram',
  'disc',
  'personality-core'
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync any guest quiz results stored in localStorage to the user's database profile (Whitelisted)
  const syncGuestResults = async (userId) => {
    try {
      const keys = Object.keys(localStorage);
      for (const key of keys) {
        if (key.startsWith('quizzy_') && !key.startsWith('quizzy_db_') && key !== ACTIVE_USER_KEY) {
          const quizId = key.replace('quizzy_', '');
          
          // Strict whitelist check: prevent dilemma/wyr answers from being converted to fake quiz results
          if (!VALID_QUIZ_IDS.includes(quizId)) continue;

          const raw = localStorage.getItem(key);
          if (raw) {
            try {
              const parsed = safeJsonParse(raw);
              if (parsed) {
                await saveUserQuizResult(userId, {
                  quizId,
                  dominantResult: parsed.dominant || parsed.title || 'Selesai',
                  dominantEmoji: parsed.emoji || '✨',
                  scores: parsed.percentages || parsed.result?.percentages || {},
                  isPublic: true
                });
                // Remove temporary guest key once safely synced
                localStorage.removeItem(key);
              }
            } catch (e) {
              console.warn('Could not sync quiz result for key:', key);
            }
          }
        }
      }
    } catch (e) {
      console.warn('Sync guest results failed', e);
    }
  };

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      initLocalDb();

      if (isSupabaseConfigured) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user && mounted) {
            const profile = await getUserProfile(session.user.id);
            setUser(profile || {
              id: session.user.id,
              email: session.user.email,
              username: session.user.user_metadata?.username || 'user',
              display_name: session.user.user_metadata?.display_name || 'Pengguna'
            });
          }
        } catch (err) {
          console.error('Supabase session init error:', err);
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
          if (!mounted) return;
          if (session?.user) {
            const profile = await getUserProfile(session.user.id);
            const userObj = profile || {
              id: session.user.id,
              email: session.user.email,
              username: session.user.user_metadata?.username || 'user',
              display_name: session.user.user_metadata?.display_name || 'Pengguna'
            };
            setUser(sanitizeUser(userObj));
            syncGuestResults(session.user.id);
          } else {
            setUser(null);
          }
        });

        if (mounted) setLoading(false);
        return () => subscription.unsubscribe();
      } else {
        // Local mode session check with safe sanitization
        const stored = localStorage.getItem(ACTIVE_USER_KEY);
        if (stored) {
          const parsed = safeJsonParse(stored);
          if (parsed && parsed.id && mounted) {
            setUser(sanitizeUser(parsed));
          } else {
            localStorage.removeItem(ACTIVE_USER_KEY);
          }
        }
        if (mounted) setLoading(false);
      }
    }

    initializeAuth();
    return () => { mounted = false; };
  }, []);

  // REGISTER
  const register = async (email, password, username, displayName, gender = 'cowo', avatarUrl = null) => {
    setLoading(true);
    try {
      const cleanUsername = (username || '').toLowerCase().replace(/[^a-z0-9_]/g, '');

      if (!cleanUsername || cleanUsername.length < 3) {
        throw new Error('Username minimal 3 karakter (hanya huruf kecil, angka, atau underscore).');
      }

      if (!email || !email.includes('@') || !email.includes('.')) {
        throw new Error('Format email tidak valid. Masukkan email yang benar.');
      }

      if (!password || password.length < 6) {
        throw new Error('Password minimal 6 karakter demi keamanan akun.');
      }

      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: cleanUsername,
              display_name: displayName?.trim() || cleanUsername,
              gender: gender,
              avatar_url: avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanUsername}`
            }
          }
        });
        if (error) throw error;

        // If email confirmation is required by Supabase settings
        if (data?.user && !data.session) {
          return {
            success: true,
            emailConfirmationRequired: true,
            message: 'Registrasi berhasil! Silakan cek email Anda untuk verifikasi akun.'
          };
        }

        if (data?.user) {
          const profile = await getUserProfile(data.user.id);
          const registeredUser = profile || {
            id: data.user.id,
            email,
            username: cleanUsername,
            display_name: displayName?.trim() || cleanUsername,
            gender: gender,
            avatar_url: avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanUsername}`
          };
          const safeUser = sanitizeUser(registeredUser);
          setUser(safeUser);
          await syncGuestResults(data.user.id);
        }
        return { success: true };
      }

      // Local fallback mode
      initLocalDb();
      const users = safeJsonParse(localStorage.getItem(LOCAL_USERS_KEY), []);
      
      const usernameExists = users.some(u => u.username && u.username.toLowerCase() === cleanUsername.toLowerCase());
      if (usernameExists) {
        throw new Error(`Username @${cleanUsername} sudah digunakan. Silakan pilih username lain.`);
      }

      const emailExists = users.some(u => u.email && u.email.toLowerCase() === email.toLowerCase().trim());
      if (emailExists) {
        throw new Error(`Email ${email} sudah terdaftar. Silakan gunakan email lain atau masuk.`);
      }

      const defaultAvatar = avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanUsername}`;
      const hashedPassword = await hashPassword(password);

      const newUserRecord = {
        id: `user-${Date.now()}`,
        email: email.toLowerCase().trim(),
        username: cleanUsername,
        display_name: (displayName && displayName.trim()) || cleanUsername,
        gender: gender || 'cowo',
        password: hashedPassword, // Stored hashed
        avatar_url: defaultAvatar,
        bio: 'Penggemar refleksi diri di Quizzy 🌱',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      users.push(newUserRecord);
      localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));

      // Sanitize user before saving to active session and state
      const safeActiveUser = sanitizeUser(newUserRecord);
      localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(safeActiveUser));
      setUser(safeActiveUser);
      await syncGuestResults(newUserRecord.id);

      return { success: true, user: safeActiveUser };
    } finally {
      setLoading(false);
    }
  };

  // LOGIN
  const login = async (emailOrUsername, password) => {
    setLoading(true);
    try {
      if (!emailOrUsername || !emailOrUsername.trim()) {
        throw new Error('Silakan masukkan username atau email.');
      }
      if (!password) {
        throw new Error('Silakan masukkan password.');
      }

      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: emailOrUsername.trim(),
          password
        });
        if (error) throw error;
        if (data?.user) {
          const profile = await getUserProfile(data.user.id);
          const safeUser = sanitizeUser(profile || { id: data.user.id, email: data.user.email });
          setUser(safeUser);
          await syncGuestResults(data.user.id);
        }
        return { success: true };
      }

      // Local fallback mode
      initLocalDb();
      const users = safeJsonParse(localStorage.getItem(LOCAL_USERS_KEY), []);
      const target = emailOrUsername.toLowerCase().trim().replace(/^@/, '');
      const matched = users.find(u => 
        (u.email && u.email.toLowerCase() === target) || 
        (u.username && u.username.toLowerCase() === target)
      );

      if (!matched) {
        throw new Error('Akun tidak ditemukan. Silakan periksa kembali username/email atau daftar akun baru.');
      }

      // Secure Password verification using hash
      const isValid = await verifyPassword(password, matched.password);
      if (!isValid) {
        throw new Error('Password salah. Silakan coba lagi.');
      }

      // Automatically upgrade legacy unhashed password to hash
      if (matched.password && matched.password.length !== 64 && !matched.password.startsWith('fb_')) {
        const hashed = await hashPassword(password);
        matched.password = hashed;
        const idx = users.findIndex(u => u.id === matched.id);
        if (idx !== -1) {
          users[idx].password = hashed;
          localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
        }
      }

      // Save sanitized user session (NEVER store password in session)
      const safeUser = sanitizeUser(matched);
      localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(safeUser));
      setUser(safeUser);
      await syncGuestResults(matched.id);
      return { success: true, user: safeUser };
    } finally {
      setLoading(false);
    }
  };

  // GOOGLE LOGIN (Disabled or transparent warning in local mode)
  const loginWithGoogle = async () => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
      });
      if (error) throw error;
      return;
    }

    throw new Error('Login Google memerlukan konfigurasi Supabase OAuth aktif. Silakan gunakan daftar/masuk dengan username dan password.');
  };

  // RESET PASSWORD REQUEST
  const resetPassword = async (email) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      if (error) throw error;
      return { success: true, message: 'Tautan reset password telah dikirim ke email Anda.' };
    }
    return {
      success: true,
      message: 'Mode lokal: Silakan daftar akun baru atau hubungi administrator untuk mereset akun.'
    };
  };

  // LOGOUT
  const logout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(ACTIVE_USER_KEY);
    setUser(null);
  };

  // UPDATE PROFILE
  const updateProfile = (updatedData) => {
    const updated = sanitizeUser({ ...user, ...updatedData });
    setUser(updated);
    if (!isSupabaseConfigured) {
      localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(updated));
      const users = safeJsonParse(localStorage.getItem(LOCAL_USERS_KEY), []);
      const idx = users.findIndex(u => u.id === updated.id);
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...updatedData };
        localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
      }
    }
  };

  // DELETE ACCOUNT (Self Data Erasure)
  const deleteAccount = async () => {
    if (!user) return false;
    if (isSupabaseConfigured) {
      // Supabase user deletion
      const { error } = await supabase.from('profiles').delete().eq('id', user.id);
      if (error) throw error;
    } else {
      initLocalDb();
      const users = safeJsonParse(localStorage.getItem(LOCAL_USERS_KEY), []);
      const filteredUsers = users.filter(u => u.id !== user.id);
      localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(filteredUsers));
    }
    await logout();
    return true;
  };

  const value = {
    user,
    loading,
    login,
    register,
    loginWithGoogle,
    resetPassword,
    deleteAccount,
    logout,
    updateProfile,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
