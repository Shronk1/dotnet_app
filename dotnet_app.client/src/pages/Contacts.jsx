import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { isAuthenticated } = useAuth();

  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/contacts');
      setContacts(response.data);
    } catch (err) {
      setError('Nie udało się pobrać listy kontaktów.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleSelectContact = async (id) => {
    try {
      const response = await api.get(`/contacts/${id}`);
      setSelectedContact(response.data);
    } catch (err) {
      alert('Nie udało się pobrać szczegółów kontaktu.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Czy na pewno chcesz usunąć ten kontakt?')) {
      try {
        await api.delete(`/contacts/${id}`);
        setSelectedContact(null);
        fetchContacts();
      } catch (err) {
        alert('Wystąpił błąd podczas usuwania kontaktu.');
      }
    }
  };

  if (isLoading) return <div className="text-center py-10">Ładowanie kontaktów...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Lista kontaktów</h1>
      
      {error && <p className="text-red-600 mb-4">{error}</p>}
      
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Lista podstawowa */}
        <div className="md:w-1/2">
          {contacts.length === 0 ? (
            <p className="text-gray-500">Brak kontaktów w bazie.</p>
          ) : (
            <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
              <ul className="divide-y divide-gray-200">
                {contacts.map(contact => (
                  <li 
                    key={contact.id} 
                    onClick={() => handleSelectContact(contact.id)}
                    className={`p-4 cursor-pointer hover:bg-blue-50 transition-colors ${selectedContact?.id === contact.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
                  >
                    <div className="font-semibold text-gray-800">{contact.firstName} {contact.lastName}</div>
                    <div className="text-sm text-gray-500 mt-1">Kategoria: <span className="font-medium text-gray-700">{contact.categoryName}</span></div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Szczegóły wybranego kontaktu */}
        <div className="md:w-1/2">
          {selectedContact ? (
            <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
                Szczegóły kontaktu
              </h2>
              
              <div className="space-y-3 text-gray-700">
                <p><strong>Imię:</strong> {selectedContact.firstName}</p>
                <p><strong>Nazwisko:</strong> {selectedContact.lastName}</p>
                <p><strong>Email:</strong> {selectedContact.email}</p>
                <p><strong>Telefon:</strong> {selectedContact.phone || '-'}</p>
                <p><strong>Data urodzenia:</strong> {selectedContact.birthDate ? new Date(selectedContact.birthDate).toLocaleDateString() : '-'}</p>
                <p><strong>Kategoria:</strong> {selectedContact.category?.name}</p>
                
                {selectedContact.category?.name.toLowerCase() === 'służbowy' && selectedContact.subcategory && (
                  <p><strong>Podkategoria:</strong> {selectedContact.subcategory.name}</p>
                )}
                {selectedContact.category?.name.toLowerCase() === 'inny' && selectedContact.customSubcategory && (
                  <p><strong>Własna podkategoria:</strong> {selectedContact.customSubcategory}</p>
                )}
              </div>

              {isAuthenticated && (
                <div className="mt-8 flex gap-4 pt-4 border-t border-gray-100">
                  <Link 
                    to={`/contacts/${selectedContact.id}/edit`}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded text-center transition-colors"
                  >
                    Edytuj
                  </Link>
                  <button 
                    onClick={() => handleDelete(selectedContact.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
                  >
                    Usuń
                  </button>
                </div>
              )}
              {!isAuthenticated && (
                <p className="text-xs text-gray-400 mt-6 italic">
                  Zaloguj się, aby edytować lub usunąć ten wpis.
                </p>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-8 border border-gray-200 text-center flex flex-col justify-center h-full min-h-[300px]">
              <p className="text-gray-500 text-lg">Wybierz kontakt z listy po lewej, aby zobaczyć szczegóły.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
