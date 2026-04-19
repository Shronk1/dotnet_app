import axios from 'axios';

const api = axios.create({
  baseURL: '/api', 
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Wymagane, aby wysyłać ciasteczka HttpOnly z każdym żądaniem
});

// Interceptor odpowiedzi - obsługuje wygaśnięcie sesji
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Jeśli serwer zwróci 401 (Unauthorized), a nie jesteśmy na stronie logowania
    if (error.response && error.response.status === 401) {
      const isMeRequest = error.config.url.includes('/auth/me');
      const isLoginPath = window.location.pathname === '/login';

      // Jeśli to nie był "cichy" check sesji na starcie i nie jesteśmy już na loginie
      if (!isMeRequest && !isLoginPath) {
        sessionStorage.setItem('session_expired', 'true');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;