// src/components/LoadingSpinner.jsx
import React from 'react';

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div
        className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
        role="status" // Para accesibilidad
      >
        {/* Círculo giratorio */}
      </div>
      <span className="text-sm text-gray-500">Cargando...</span>
    </div>
  );
}

export default LoadingSpinner;
