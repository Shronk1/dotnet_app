import { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axiosConfig';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Automatyczne sprawdzanie sesji (Cookie) podczas ładowania aplikacji (np. po F5)
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await api.get('/auth/me');
        setIsAuthenticated(true);
        setUserEmail(response.data.email);
      } catch (error) {
        setIsAuthenticated(false);
        setUserEmail(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  // Nowa metoda logowania - wywołuje backend, a on ustawia ciasteczko
  const login = async (email, password) => {
    await api.post('/auth/login', { email, password });
    setIsAuthenticated(true);
    setUserEmail(email);
  };

  // Wylogowanie żąda usunięcia ciasteczka z backendu
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error("Błąd podczas wylogowywania", error);
    } finally {
      setIsAuthenticated(false);
      setUserEmail(null);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userEmail, isLoading, login, logout }}>
      { children }
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
