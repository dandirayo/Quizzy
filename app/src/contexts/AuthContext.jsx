import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Placeholder login function
  const login = async (email, password) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setUser({ id: '1', username: 'pengguna_demo', email });
      setLoading(false);
    }, 1000);
  };

  // Placeholder logout function
  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
