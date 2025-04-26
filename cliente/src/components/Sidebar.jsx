// src/components/Sidebar.jsx
import React from 'react';
// --- CORRECCIÓN: Importar useLocation ---
import { Link, useLocation } from 'react-router-dom';

// Asume que recibe isOpen y toggleSidebar
function Sidebar({ isOpen, toggleSidebar }) {
  // --- CORRECCIÓN: Obtener la ubicación actual ---
  const location = useLocation();

  // --- CORRECCIÓN: Definir la función isActive ---
  const isActive = (path) => location.pathname === path;

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-40 w-64
        bg-gray-800 text-white p-4
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        bp880:relative
        bp880:translate-x-0
        bp880:z-auto
        bp880:flex-shrink-0
        bp880:block
      `}
    >
      {/* Botón para cerrar en móvil */}
      <button
        onClick={toggleSidebar}
        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-white bp880:hidden"
        aria-label="Cerrar menú"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Contenido del Sidebar */}
      <div className="mb-8 mt-8 bp880:mt-0">
        <h2 className="text-2xl font-semibold text-center">Tu Logo</h2>
      </div>
      <nav>
        <ul>
          {/* --- Ahora isActive está definida y funcionará --- */}
          <li>
            <Link
              to="/admin"
              className={`block px-4 py-2 rounded hover:bg-gray-700 ${isActive('/admin') ? 'bg-gray-700 font-semibold' : ''}`}
              onClick={isOpen ? toggleSidebar : undefined} // Cierra sidebar en móvil al hacer clic
            >
              📊 Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/admin/noticias"
              className={`block px-4 py-2 rounded hover:bg-gray-700 ${isActive('/admin/noticias') ? 'bg-gray-700 font-semibold' : ''}`}
              onClick={isOpen ? toggleSidebar : undefined}
            >
              📰 Noticias
            </Link>
          </li>
          <li>
            <Link
              to="/admin/fechas"
              className={`block px-4 py-2 rounded hover:bg-gray-700 ${isActive('/admin/fechas') ? 'bg-gray-700 font-semibold' : ''}`}
              onClick={isOpen ? toggleSidebar : undefined}
            >
              🗓️ Fechas
            </Link>
          </li>
          <li>
            <Link
              to="/admin/fixture" // Asumiendo que esta es la ruta del calendario
              className={`block px-4 py-2 rounded hover:bg-gray-700 ${isActive('/admin/fixture') ? 'bg-gray-700 font-semibold' : ''}`}
              onClick={isOpen ? toggleSidebar : undefined}
            >
              📅 Calendario
            </Link>
          </li>
          <li>
            <Link
              to="/admin/equipos"
              className={`block px-4 py-2 rounded hover:bg-gray-700 ${isActive('/admin/equipos') ? 'bg-gray-700 font-semibold' : ''}`}
              onClick={isOpen ? toggleSidebar : undefined}
            >
              🛡️ Equipos
            </Link>
          </li>
          <li>
            <Link
              to="/admin/jugadores"
              className={`block px-4 py-2 rounded hover:bg-gray-700 ${isActive('/admin/jugadores') ? 'bg-gray-700 font-semibold' : ''}`}
              onClick={isOpen ? toggleSidebar : undefined}
            >
              👥 Jugadores
            </Link>
          </li>
          <li>
            <Link
              to="/admin/goles"
              className={`block px-4 py-2 rounded hover:bg-gray-700 ${isActive('/admin/goles') ? 'bg-gray-700 font-semibold' : ''}`}
              onClick={isOpen ? toggleSidebar : undefined}
            >
              ⭐ Sumar Goles
            </Link>
          </li>
          <li>
            <Link
              to="/admin/alert" // Ruta para la página de gestión de alertas
              className={`block px-4 py-2 rounded hover:bg-gray-700 ${isActive('/admin/alert') ? 'bg-gray-700 font-semibold' : ''}`}
              onClick={isOpen ? toggleSidebar : undefined}
            >
              🔔 Gestionar Alerta {/* Icono y texto del enlace */}
            </Link>
          </li>
          {/* Añade más links aquí */}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
