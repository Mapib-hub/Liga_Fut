// src/pages/admin/NotFoundAdmin.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FiAlertTriangle } from 'react-icons/fi'; // Un icono diferente, quizás

function NotFoundAdmin() {
  return (
    // Usamos clases que podrían encajar mejor en un dashboard (fondo claro, texto oscuro)
    // Puedes ajustar 'bg-gray-100' si tu layout admin usa otro fondo
    <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8 bg-gray-100">

      <FiAlertTriangle size={60} className="text-yellow-500 mb-6" />

      {/* Título del Error */}
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
        404
      </h1>
      <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-4">
        Página No Encontrada
      </h2>

      {/* Mensaje Descriptivo */}
      <p className="text-md text-gray-500 mb-8 max-w-md">
        La sección del panel de administración que intentas visitar no existe o ha sido movida.
      </p>

      {/* Botón para Volver al Dashboard Admin */}
      <Link
        to="/admin" // Enlace al dashboard principal del admin
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out"
        // Puedes usar los colores de tu tema admin si son diferentes (ej. bg-primary-admin)
      >
        Volver al Dashboard
      </Link>

    </div>
  );
}

export default NotFoundAdmin;
