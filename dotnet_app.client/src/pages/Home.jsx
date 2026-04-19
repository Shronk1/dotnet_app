export const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <h1 className="text-5xl font-extrabold text-blue-700 mb-6 text-center">
        Witaj w aplikacji Kontaktów
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl text-center mb-8">
        Zarządzaj swoimi kontaktami szybko, łatwo i bezpiecznie. 
        Zaloguj się, aby uzyskać pełny dostęp do możliwości dodawania, edycji i usuwania wpisów.
      </p>
      <div className="flex space-x-4">
        <a 
          href="/contacts" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-colors"
        >
          Przeglądaj kontakty
        </a>
      </div>
    </div>
  );
};
