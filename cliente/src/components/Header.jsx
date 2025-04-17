// src/components/Header.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';

// Recibe toggleSidebar como prop
function Header({ toggleSidebar }) {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center z-20"> {/* Añadido z-index */}
      {/* Botón Hamburguesa - Visible solo en móvil (md:hidden) */}
      <button onClick={toggleSidebar} className="text-gray-500 focus:outline-none md:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>

      {/* Título o Logo (Ajustar margen si es necesario en móvil) */}
      <div className="flex-1 md:flex-none md:ml-0 ml-4"> {/* Ajuste de margen para móvil */}
         <h1 className="text-lg font-semibold">Panel de Administración</h1>
      </div>


      {/* Nombre de usuario y botón de logout */}
      <div className="flex items-center">
        <span className="hidden sm:inline mr-3">Hola, {user?.username || user?.email}</span> {/* Ocultar en pantallas muy pequeñas */}
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-sm" // Reducir tamaño texto/padding
        >
          Cerrar Sesión
        </button>
      </div>
    </header>
  );
}

export default Header;
