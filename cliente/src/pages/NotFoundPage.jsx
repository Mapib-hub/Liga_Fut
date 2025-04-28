// src/pages/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

// --- ¡IMPORTANTE! ---
// Cambia esta línea por la ruta y nombre correctos de tu imagen generada.
// Asegúrate de que la imagen esté en una carpeta accesible, como 'src/assets/images/'.
import errorSilhouetteImage from '../assets/images/error_02.jpg'; // <-- AJUSTA ESTA RUTA

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 py-8 bg-gray-50"> {/* Ajusta el fondo si es necesario */}

      {/* Imagen de Error */}
      <img
        src={errorSilhouetteImage} // Usa la imagen importada
        alt="Ilustración de error - Página no encontrada"
        className="w-64 h-auto mb-8" // Ajusta el tamaño (w-64) si es necesario
      />

      {/* Título del Error */}
      <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
        404
      </h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-4">
        Página No Encontrada
      </h2>

      {/* Mensaje Descriptivo */}
      <p className="text-md md:text-lg text-gray-500 mb-8 max-w-md">
        ¡Ups! Parece que te has perdido. La página que buscas no existe o ha sido movida.
        Todos cometemos errores, ¡hasta en el fútbol!
      </p>

      {/* Botón para Volver al Inicio */}
      <Link
        to="/" // Enlace a la página principal
        className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 ease-in-out"
      >
        Volver al Inicio
      </Link>

    </div>
  );
}

export default NotFoundPage;
