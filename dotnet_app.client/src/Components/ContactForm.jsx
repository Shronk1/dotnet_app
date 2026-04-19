import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

export const ContactForm = ({ initialData, isEditMode = false }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    categoryId: '',
    subcategoryId: '',
    customSubcategory: ''
  });

  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data);
      } catch (err) {
        setError('Nie udało się pobrać kategorii.');
      }
    };

    fetchCategories().then(() => {
      if (initialData) {
        setFormData({
          firstName: initialData.firstName || '',
          lastName: initialData.lastName || '',
          email: initialData.email || '',
          phone: initialData.phone || '',
          birthDate: initialData.birthDate ? initialData.birthDate.split('T')[0] : '',
          categoryId: initialData.categoryId || '',
          subcategoryId: initialData.subcategoryId || '',
          customSubcategory: initialData.customSubcategory || ''
        });
      }
      setIsLoading(false);
    });
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset subcategories when category changes
      ...(name === 'categoryId' && { subcategoryId: '', customSubcategory: '' })
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName || null,
        email: formData.email,
        phone: formData.phone || null,
        birthDate: formData.birthDate || null,
        categoryId: parseInt(formData.categoryId, 10),
      };

      const selectedCategory = categories.find(c => c.id === parseInt(formData.categoryId, 10));
      
      if (selectedCategory?.name.toLowerCase() === 'służbowy') {
        payload.subcategoryId = parseInt(formData.subcategoryId, 10);
      } else if (selectedCategory?.name.toLowerCase() === 'inny') {
        payload.customSubcategory = formData.customSubcategory;
      }

      if (isEditMode) {
        await api.put(`/contacts/${initialData.id}`, payload);
      } else {
        await api.post('/contacts', payload);
      }
      
      navigate('/contacts');
    } catch (err) {
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          setError(err.response.data);
        } else if (err.response.data.title) {
           setError(err.response.data.title);
        } else {
           setError('Wystąpił błąd podczas zapisu.');
        }
      } else {
        setError('Wystąpił problem z połączeniem z serwerem.');
      }
    }
  };

  if (isLoading) return <p className="text-center py-4">Ładowanie formularza...</p>;

  const selectedCategory = categories.find(c => c.id === parseInt(formData.categoryId, 10));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">Imię *</label>
          <input type="text" name="firstName" required value={formData.firstName} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">Nazwisko</label>
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">Email *</label>
          <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">Telefon</label>
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">Data urodzenia</label>
          <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">Kategoria *</label>
          <select name="categoryId" required value={formData.categoryId} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white">
            <option value="" disabled>Wybierz kategorię</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {selectedCategory?.name.toLowerCase() === 'służbowy' && (
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">Podkategoria (służbowy) *</label>
          <select name="subcategoryId" required value={formData.subcategoryId} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white">
            <option value="" disabled>Wybierz podkategorię</option>
            {selectedCategory.subcategories.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      )}

      {selectedCategory?.name.toLowerCase() === 'inny' && (
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">Własna podkategoria *</label>
          <input type="text" name="customSubcategory" required value={formData.customSubcategory} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </div>
      )}

      <div className="pt-4">
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition-colors">
          {isEditMode ? 'Zapisz zmiany' : 'Dodaj kontakt'}
        </button>
      </div>
    </form>
  );
};
