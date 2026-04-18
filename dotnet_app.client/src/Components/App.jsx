import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Przykładowe widoki na start
const Home = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Witaj w aplikacji Kontaktów</h1>
      <p className="text-gray-600">Frontend w React.js pomyślnie skonfigurowany z Tailwind CSS oraz React Router!</p>
    </div>
  </div>
);

const NotFound = () => (
  <div className="flex min-h-screen items-center justify-center">
    <h1 className="text-2xl text-red-500">404 - Strona nie znaleziona</h1>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Później dodamy tutaj kolejne trasy np. /login, /contacts */}
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;