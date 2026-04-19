export const LoadingOverlay = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/30 backdrop-blur-sm transition-all">
      <div className="flex flex-col items-center">
        {/* Elegancki, duży spinner */}
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin shadow-lg"></div>
        <p className="mt-4 text-blue-900 font-bold text-xl drop-shadow-sm tracking-wide">
          Przetwarzanie...
        </p>
      </div>
    </div>
  );
};
