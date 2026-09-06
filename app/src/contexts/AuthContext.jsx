import { createContext, useState, useContext, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { getUserProfile, saveUserQuizResult } from '../services/db';

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
  const register = async (email, password, username, displayName) => {
    setLoading(true);
    try {
      const cleanUsername = username.toLowerCase().replace(/[^a-z0-9_]/g, '');

      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: cleanUsername,
              display_name: displayName || cleanUsername
            }
          }
        });
        if (error) throw error;
        if (data?.user) {
          const profile = await getUserProfile(data.user.id);
          setUser(profile || { id: data.user.id, email, username: cleanUsername, display_name: displayName });
          await syncGuestResults(data.user.id);
        }
        return { success: true };
      }

      // Local fallback mode
      const users = JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '[]');
      const exists = users.some(u => u.username.toLowerCase() === cleanUsername.toLowerCase() || u.email === email);
      if (exists) {
        throw new Error('Username atau email sudah digunakan.');
      }

      const newUser = {
        id: `user-${Date.now()}`,
        email,
        username: cleanUsername,
        display_name: displayName || cleanUsername,
        avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanUsername}`,
        bio: 'Penggemar refleksi diri di Quizzy 🌱',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
      localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(newUser));
      setUser(newUser);
      await syncGuestResults(newUser.id);
      return { success: true };
    } finally {
      setLoading(false);
    }
  };

  // LOGIN
  const login = async (emailOrUsername, password) => {
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        // If email is supplied
        const { data, error } = await supabase.auth.signInWithPassword({
          email: emailOrUsername,
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
      const users = JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '[]');
      const target = emailOrUsername.toLowerCase().trim();
      const matched = users.find(u => 
        (u.email && u.email.toLowerCase() === target) || 
        (u.username && u.username.toLowerCase() === target)
      );

      if (!matched) {
        // If demo credentials or new user not in list, auto-create demo profile
        const cleanName = target.includes('@') ? target.split('@')[0] : target;
        const demoUser = {
          id: `user-${Date.now()}`,
          email: target.includes('@') ? target : `${target}@example.com`,
          username: cleanName,
          display_name: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
          avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanName}`,
          bio: 'Penjelajah psikologi Quizzy ✨',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        users.push(demoUser);
        localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
        localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(demoUser));
        setUser(demoUser);
        await syncGuestResults(demoUser.id);
        return { success: true };
      }

      localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(matched));
      setUser(matched);
      await syncGuestResults(matched.id);
      return { success: true };
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
    const googleDemoUser = {
      id: `google-user-${Date.now()}`,
      email: 'google.user@gmail.com',
      username: 'user_google',
      display_name: 'Google User',
      avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=google',
      bio: 'Masuk melalui Google Sign-in 🌐',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(googleDemoUser));
    setUser(googleDemoUser);
    await syncGuestResults(googleDemoUser.id);
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
