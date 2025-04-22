// src/components/Header.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';

// Recibe toggleSidebar como prop
function Header({ toggleSidebar }) {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center z-20">
      {/* Botón Hamburguesa - MODIFICADO: Cambiado md:hidden a bp880:hidden */}
      <button onClick={toggleSidebar} className="text-gray-500 focus:outline-none bp880:hidden"> {/* Visible solo bajo 880px */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>

      {/* Título o Logo */}
      {/* Ajuste de margen para que no se pegue al botón hamburguesa en móvil */}
      <div className="flex-1 bp880:flex-none ml-4 bp880:ml-0">
         <h1 className="text-lg font-semibold">Panel de Administración</h1>
      </div>

      {/* Nombre de usuario y botón de logout */}
      <div className="flex items-center">
        <span className="hidden sm:inline mr-3">Hola, {user?.username || user?.email}</span>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-sm"
        >
          Cerrar Sesión
        </button>
      </div>
    </header>
  );
}

export default Header;
