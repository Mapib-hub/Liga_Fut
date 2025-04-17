// src/components/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

// Recibe isOpen y toggleSidebar como props
function Sidebar({ isOpen, toggleSidebar }) {
  return (
    // Clases base + transiciones + posicionamiento móvil + posicionamiento desktop
    <aside
      className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-gray-800 text-white p-4 flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} // Controla visibilidad en móvil
        md:relative md:translate-x-0 md:z-auto // Resetea para desktop
      `}
    >
      {/* Botón opcional para cerrar desde dentro del sidebar en móvil */}
      <button onClick={toggleSidebar} className="absolute top-2 right-2 text-white md:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <h2 className="text-xl font-semibold mb-6 mt-8 md:mt-0">Admin Liga</h2> {/* Añadido margen superior para móvil */}
      <nav className="flex-1"> {/* Añadido flex-1 para que la nav ocupe espacio */}
        <ul>
          {/* --- Enlaces --- (Añadir onClick={toggleSidebar} a cada Link para cerrar al navegar en móvil) */}
          <li className="mb-2">
            <Link to="/admin/dashboard" onClick={toggleSidebar} className="hover:bg-gray-700 p-2 block rounded">Dashboard</Link>
          </li>
          <li className="mb-2">
            <Link to="/admin/jugadores" onClick={toggleSidebar} className="hover:bg-gray-700 p-2 block rounded">Jugadores</Link>
          </li>
          <li className="mb-2">
            <Link to="/admin/equipos" onClick={toggleSidebar} className="hover:bg-gray-700 p-2 block rounded">Equipos</Link>
          </li>
          <li className="mb-2">
            <Link to="/admin/noticias" onClick={toggleSidebar} className="hover:bg-gray-700 p-2 block rounded">Noticias</Link>
          </li>
          <li className="mb-2">
            <Link to="/admin/jornadas" onClick={toggleSidebar} className="hover:bg-gray-700 p-2 block rounded">Jornadas</Link>
          </li>
          <li className="mb-2">
            <Link to="/tasks" onClick={toggleSidebar} className="hover:bg-gray-700 p-2 block rounded">Tasks (Ejemplo)</Link>
          </li>
           <li className="mb-2">
            <Link to="/profile" onClick={toggleSidebar} className="hover:bg-gray-700 p-2 block rounded">Perfil (Ejemplo)</Link>
          </li>
        </ul>
      </nav>
      {/* Puedes añadir más cosas al sidebar si es necesario */}
      <div className="mt-auto">
         {/* Info usuario o logout */}
      </div>
    </aside>
  );
}

export default Sidebar;
