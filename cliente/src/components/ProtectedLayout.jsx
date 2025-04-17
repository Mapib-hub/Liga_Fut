// src/components/ProtectedLayout.jsx
import React, { useState } from 'react'; // Importar useState
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

function ProtectedLayout() {
  // Estado para controlar la visibilidad del sidebar en móvil
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Función para cambiar el estado
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    // Mantenemos el flex container principal
    <div className="relative flex h-screen bg-gray-100 overflow-hidden"> {/* Añadido relative y overflow-hidden */}

      {/* Barra Lateral: Pasamos el estado y la función para cerrarla */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Barra Superior: Pasamos la función para abrir/cerrar */}
        <Header toggleSidebar={toggleSidebar} />

        {/* Área de Contenido */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
          <Outlet />
        </main>
      </div>

      {/* Overlay para cerrar el sidebar en móvil al hacer clic fuera */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden" // Visible solo en móvil y cuando el sidebar está abierto
          onClick={toggleSidebar} // Cierra el sidebar al hacer clic
        ></div>
      )}
    </div>
  );
}

export default ProtectedLayout;
