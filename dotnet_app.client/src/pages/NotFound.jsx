import { Link } from 'react-router-dom';

export const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-9xl font-black text-gray-200">404</h1>
      <h2 className="text-4xl font-bold text-gray-800 mt-4 mb-6">Strona nie znaleziona</h2>
      <p className="text-lg text-gray-600 mb-8 max-w-md">
        Przepraszamy, ale strona, której szukasz, nie istnieje lub została przeniesiona.
      </p>
      <Link 
        to="/" 
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md"
      >
        Wróć na stronę główną
      </Link>
    </div>
  );
};
