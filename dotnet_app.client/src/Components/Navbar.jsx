import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { isAuthenticated, userEmail, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Lewa strona: Logo i linki */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold tracking-wider hover:text-blue-200 transition-colors">
              🏠
            </Link>
            
            <div className="hidden md:flex space-x-4">
              <Link 
                to="/contacts" 
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Przeglądaj
              </Link>
              
              {/* Opcja "Dodaj" widoczna tylko dla zalogowanych */}
              {isAuthenticated && (
                <Link 
                  to="/contacts/new" 
                  className="px-3 py-2 rounded-md text-sm font-medium bg-blue-500 hover:bg-blue-400 transition-colors shadow-sm"
                >
                  + Dodaj kontakt
                </Link>
              )}
            </div>
          </div>

          {/* Prawa strona: Informacje o koncie i logowanie */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-blue-100 hidden sm:block">
                  Zalogowany: <strong className="text-white">{userEmail}</strong>
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 border border-blue-400 rounded-md text-sm font-medium hover:bg-blue-700 hover:border-white transition-all focus:outline-none"
                >
                  Wyloguj
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-white text-blue-600 rounded-md text-sm font-bold hover:bg-gray-100 transition-colors shadow-sm"
              >
                Zaloguj się
              </Link>
            )}
          </div>
          
        </div>
      </div>
    </nav>
  );
};
