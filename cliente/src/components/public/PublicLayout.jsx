// src/components/public/layout/PublicLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar'; // Ajusta la ruta si es necesario
import Footer from './Footer'; // Ajusta la ruta si es necesario

function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen"> {/* Asegura que el footer quede abajo */}
      <Navbar />
      <main className="flex-grow"> {/* El contenido principal ocupa el espacio restante */}
        {/* Aquí se renderizará HomePage, TablaPage, etc. */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default PublicLayout;
