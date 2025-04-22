// src/components/ProtectedLayout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar'; // Asumiendo que Sidebar.jsx será modificado (ver paso 3)
import Header from './Header';   // Asumiendo que Header.jsx será modificado (ver paso 4)

function ProtectedLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="relative flex h-screen bg-gray-100 overflow-hidden">

      {/* Barra Lateral: Sigue recibiendo props para el toggle móvil */}
      {/* La lógica de mostrarse/ocultarse según el breakpoint estará DENTRO de Sidebar.jsx */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Contenido Principal */}
      {/*
        MODIFICACIÓN CLAVE:
        - ml-0: Sin margen izquierdo por defecto (cuando el sidebar está oculto o es móvil).
        - bp880:ml-64: Añade un margen izquierdo de 64 (ancho del sidebar, ajústalo si es diferente)
                      cuando la pantalla es de 880px o más, dejando espacio para el sidebar fijo.
      */}
      <div className="flex-1 flex flex-col overflow-hidden ml-0 transition-all duration-300 ease-in-out"> {/* <--- ESTA LÍNEA */}  {/* Barra Superior: Pasamos la función para abrir/cerrar */}
        <Header toggleSidebar={toggleSidebar} />

        {/* Área de Contenido */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-4 md:p-6"> {/* Padding añadido */}
          <Outlet />
        </main>
      </div>

      {/* Overlay para cerrar el sidebar en móvil al hacer clic fuera */}
      {/* MODIFICACIÓN: Cambiado md:hidden a bp880:hidden */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 bp880:hidden" // Visible solo bajo 880px y cuando el sidebar está abierto
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
}

export default ProtectedLayout;
