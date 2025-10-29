import React from 'react';

interface HeaderProps {
  onClearChat?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onClearChat }) => {
  return (
    <header className="bg-white shadow-md p-4 border-b-2 border-[#D3CBB8]">
      <div className="max-w-6xl mx-auto">
        {/* Layout vertical en móvil, horizontal en desktop */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
          
          {/* Logo y título - Siempre arriba/izquierda */}
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="bg-[#8B4513] text-white p-2 rounded-lg">
              <span className="text-xl">📚</span>
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-[#8B4513] tracking-tight">
                Curador Literario
              </h1>
              <p className="text-xs md:text-sm text-[#93A1A1] mt-1">
                Tu guía personal en el mundo de los libros
              </p>
            </div>
          </div>

          {/* Botones de acción - Debajo en móvil, derecha en desktop */}
          <div className="flex items-center justify-center sm:justify-end gap-3">
            {/* Botón Limpiar Chat */}
            {onClearChat && (
              <button
                onClick={onClearChat}
                className="flex items-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg font-medium min-h-[44px]"
                title="Limpiar conversación"
              >
                <span className="text-lg">🗑️</span>
                <span className="text-sm font-semibold hidden xs:inline">
                  Limpiar Chat
                </span>
              </button>
            )}

            {/* Indicador de estado */}
            <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg min-h-[44px]">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-700 font-medium">
                En línea
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de progreso sutil */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#8B4513] via-[#D3CBB8] to-[#93A1A1] opacity-30"></div>
    </header>
  );
};

export default Header;
