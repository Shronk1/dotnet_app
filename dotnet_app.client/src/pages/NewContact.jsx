import { ContactForm } from '../components/ContactForm';

export const NewContact = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Dodaj nowy kontakt</h1>
      
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <ContactForm isEditMode={false} />
      </div>
    </div>
  );
};
