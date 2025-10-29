import React from 'react';

interface HeaderProps {
  onClearChat?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onClearChat }) => {
  return (
    <header className="bg-white shadow-sm p-1 border-b border-[#D3CBB8]">
      <div className="max-w-6xl mx-auto">
        {/* Layout más compacto */}
        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 xs:gap-0">
          
          {/* Logo y título - Más compacto */}
          <div className="flex items-center gap-2 justify-center xs:justify-start">
            <div className="bg-[#8B4513] text-white p-0.5 rounded-lg">
              <span className="text-lg">📚</span>
            </div>
            <div className="text-center xs:text-left">
              <h1 className="text-xl font-bold text-[#8B4513] tracking-tight leading-tight">
                Curador Literario
              </h1>
              <p className="text-xs text-[#93A1A1] hidden xs:block">
                Tu guía en el mundo de los libros
              </p>
            </div>
          </div>

          {/* Botones de acción - Más compactos */}
          <div className="flex items-center justify-center xs:justify-end gap-2">
            {/* Botón Limpiar Chat */}
            {onClearChat && (
              <button
                onClick={onClearChat}
                className="flex items-center gap-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow font-medium text-sm"
                title="Limpiar conversación"
              >
                <span className="text-base">🗑️</span>
                <span className="font-medium hidden xs:inline">
                  Limpiar
                </span>
              </button>
            )}

            {/* Indicador de estado más pequeño */}
            <div className="flex items-center gap-1 px-2 py-1.5 bg-green-50 border border-green-200 rounded-lg">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-700 font-medium hidden xs:inline">
                En línea
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
