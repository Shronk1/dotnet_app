import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import { useAuth } from '../context/AuthContext';

// Importy stron
import { Home } from '../pages/Home';
import { Contacts } from '../pages/Contacts';
import { NewContact } from '../pages/NewContact';
import { EditContact } from '../pages/EditContact';
import { Login } from '../pages/Login';
import { NotFound } from '../pages/NotFound';

// Komponent zabezpieczający trasy dla zalogowanych użytkowników
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return null; // Zabezpieczenie na wypadek mignięcia (AuthContext dba o globalny loading)
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Nawigacja zawsze na górze */}
        <Navbar />
        
        {/* Główna zawartość strony */}
        <main className="grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            
            {/* Trasa ogólnodostępna - przeglądanie */}
            <Route path="/contacts" element={<Contacts />} />
            
            {/* Trasa chroniona - dodawanie */}
            <Route 
              path="/contacts/new" 
              element={
                <ProtectedRoute>
                  <NewContact />
                </ProtectedRoute>
              } 
            />

            {/* Trasa chroniona - edycja */}
            <Route 
              path="/contacts/:id/edit" 
              element={
                <ProtectedRoute>
                  <EditContact />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch-all dla strony 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
