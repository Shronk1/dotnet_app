import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { LoadingOverlay } from './LoadingOverlay';

export const AuthForm = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionExpiredMsg, setSessionExpiredMsg] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem('session_expired') === 'true') {
      setSessionExpiredMsg(true);
      sessionStorage.removeItem('session_expired'); // Usuwamy, żeby nie straszyło po F5
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLoginMode) {
        await login(email, password);
        navigate('/'); // Przekierowanie na stronę główną po zalogowaniu
      } else {
        // Rejestracja
        await api.post('/auth/register', { email, password });
        // Po udanej rejestracji (która ustawia ciasteczko wg naszego backendu), 
        // musimy poinformować o tym AuthContext. 
        // Najprościej odświeżyć stronę, co wyzwoli useEffect w AuthContext i zaczyta stan sesji.
        window.location.href = '/'; 
      }
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.errors) {
        // Obsługa błędów walidacji z Identity (np. za słabe hasło)
        const errorMessages = Object.values(err.response.data.errors).flat();
        setError(errorMessages.join(' '));
      } else {
        setError('Wystąpił problem z połączeniem z serwerem.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <LoadingOverlay isLoading={isLoading} />
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border border-gray-200">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
            {isLoginMode ? 'Logowanie' : 'Rejestracja'}
          </h2>

          {sessionExpiredMsg && (
            <div className="bg-amber-50 border-l-4 border-amber-500 text-amber-700 p-4 mb-6" role="alert">
              <p className="font-bold">Sesja wygasła</p>
              <p className="text-sm">Zaloguj się ponownie, aby kontynuować pracę.</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
                Adres Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Jan.Kowalski@example.com"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">
                Hasło
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="••••••••"
              />
              {!isLoginMode && (
                <p className="mt-1 text-xs text-gray-500">
                  Hasło musi zawierać min. 8 znaków, wielką i małą literę oraz cyfrę.
                </p>
              )}
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {isLoginMode ? 'Zaloguj się' : 'Zarejestruj konto'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => { setIsLoginMode(!isLoginMode); setError(''); }}
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors focus:outline-none"
            >
              {isLoginMode 
                ? 'Nie masz jeszcze konta? Zarejestruj się!' 
                : 'Masz już konto? Przejdź do logowania'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
