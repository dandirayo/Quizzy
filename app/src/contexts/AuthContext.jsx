import { createContext, useState, useContext, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { getUserProfile, saveUserQuizResult, initLocalDb } from '../services/db';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const ACTIVE_USER_KEY = 'quizzy_active_user_session';
const LOCAL_USERS_KEY = 'quizzy_db_users';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync any guest quiz results stored in localStorage to the user's database profile
  const syncGuestResults = async (userId) => {
    try {
      const keys = Object.keys(localStorage);
      for (const key of keys) {
        if (key.startsWith('quizzy_') && !key.startsWith('quizzy_db_') && key !== ACTIVE_USER_KEY) {
          const raw = localStorage.getItem(key);
          if (raw) {
            try {
              const parsed = JSON.parse(raw);
              const quizId = key.replace('quizzy_', '');
              await saveUserQuizResult(userId, {
                quizId,
                dominantResult: parsed.dominant || parsed.title || 'Selesai',
                dominantEmoji: parsed.emoji || '✨',
                scores: parsed.percentages || parsed.result?.percentages || {},
                isPublic: true
              });
              // Remove temporary guest key so it does not sync repeatedly
              localStorage.removeItem(key);
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
      // Initialize seed database first if needed
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
            setUser(userObj);
            syncGuestResults(session.user.id);
          } else {
            setUser(null);
          }
        });

        if (mounted) setLoading(false);
        return () => subscription.unsubscribe();
      } else {
        // Local mode session check
        const stored = localStorage.getItem(ACTIVE_USER_KEY);
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (mounted) setUser(parsed);
          } catch (e) {
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
  const register = async (email, password, username, displayName, gender = 'male', avatarUrl = null) => {
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
          setUser(registeredUser);
          await syncGuestResults(data.user.id);
        }
        return { success: true };
      }

      // Local fallback mode
      initLocalDb();
      const users = JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '[]');
      
      const usernameExists = users.some(u => u.username && u.username.toLowerCase() === cleanUsername.toLowerCase());
      if (usernameExists) {
        throw new Error(`Username @${cleanUsername} sudah digunakan. Silakan pilih username lain.`);
      }

      const emailExists = users.some(u => u.email && u.email.toLowerCase() === email.toLowerCase().trim());
      if (emailExists) {
        throw new Error(`Email ${email} sudah terdaftar. Silakan gunakan email lain atau masuk.`);
      }

      const defaultAvatar = avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanUsername}`;

      const newUser = {
        id: `user-${Date.now()}`,
        email: email.toLowerCase().trim(),
        username: cleanUsername,
        display_name: (displayName && displayName.trim()) || cleanUsername,
        gender: gender || 'male',
        password: password,
        avatar_url: defaultAvatar,
        bio: 'Penggemar refleksi diri di Quizzy 🌱',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
      localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(newUser));
      setUser(newUser);
      await syncGuestResults(newUser.id);
      return { success: true, user: newUser };
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
          setUser(profile || { id: data.user.id, email: data.user.email });
          await syncGuestResults(data.user.id);
        }
        return { success: true };
      }

      // Local fallback mode
      initLocalDb();
      const users = JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '[]');
      const target = emailOrUsername.toLowerCase().trim().replace(/^@/, '');
      const matched = users.find(u => 
        (u.email && u.email.toLowerCase() === target) || 
        (u.username && u.username.toLowerCase() === target)
      );

      if (!matched) {
        throw new Error('Akun tidak ditemukan. Silakan periksa kembali username/email atau daftar akun baru.');
      }

      // Password verification
      if (matched.password) {
        const isDemo = (matched.username === 'dendiz7' || matched.username === 'dea33');
        if (matched.password !== password && !(isDemo && password === 'demo123')) {
          throw new Error('Password salah. Silakan coba lagi.');
        }
      } else {
        // Upgrade legacy user record with entered password
        matched.password = password;
        const idx = users.findIndex(u => u.id === matched.id);
        if (idx !== -1) {
          users[idx].password = password;
          localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
        }
      }

      localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(matched));
      setUser(matched);
      await syncGuestResults(matched.id);
      return { success: true, user: matched };
    } finally {
      setLoading(false);
    }
  };

  // GOOGLE LOGIN
  const loginWithGoogle = async () => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
      });
      if (error) throw error;
      return;
    }

    // Local fallback demo
    initLocalDb();
    const users = JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '[]');
    let googleUser = users.find(u => u.email === 'google.user@gmail.com');

    if (!googleUser) {
      googleUser = {
        id: `google-user-${Date.now()}`,
        email: 'google.user@gmail.com',
        username: 'google_user',
        display_name: 'Google User',
        gender: 'other',
        password: 'google_oauth_user',
        avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=google_user',
        bio: 'Masuk melalui Google Sign-in 🌐',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      users.push(googleUser);
      localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
    }

    localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(googleUser));
    setUser(googleUser);
    await syncGuestResults(googleUser.id);
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
    const updated = { ...user, ...updatedData };
    setUser(updated);
    if (!isSupabaseConfigured) {
      localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(updated));
      const users = JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '[]');
      const idx = users.findIndex(u => u.id === updated.id);
      if (idx !== -1) {
        users[idx] = updated;
        localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
      }
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    loginWithGoogle,
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
