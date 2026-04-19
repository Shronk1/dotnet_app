import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { ContactForm } from '../components/ContactForm';

export const EditContact = () => {
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await api.get(`/contacts/${id}`);
        setInitialData(response.data);
      } catch (err) {
        setError('Nie udało się pobrać danych kontaktu.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContact();
  }, [id]);

  if (isLoading) return <div className="text-center py-10">Pobieranie danych kontaktu...</div>;

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={() => navigate('/contacts')} className="bg-blue-600 text-white px-4 py-2 rounded">
          Wróć do listy
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Edytuj kontakt</h1>
      
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <ContactForm initialData={initialData} isEditMode={true} />
      </div>
    </div>
  );
};
