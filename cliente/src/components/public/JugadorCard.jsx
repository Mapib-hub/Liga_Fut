// src/components/public/JugadorCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import RenderJugadorFoto from './RenderJugadorFoto'; // Reutilizamos el componente de foto
import { FiAward } from 'react-icons/fi'; // Icono para goles

function JugadorCard({ jugador }) {
 
  // Si no hay datos del jugador, no renderizar nada o un placeholder simple
  if (!jugador) {
    return null; // O un esqueleto de carga si prefieres
  }

  // Asume que la ruta pública para el detalle del jugador será /web/jugadores/:id
  const linkTo = `/web/jugadores/${jugador._id}`;

  return (
    // Enlace que envuelve toda la tarjeta
    <Link
      to={linkTo}
      className="flex items-center p-3 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-150 ease-in-out group"
    >
      {/* Foto del Jugador (usando el componente reutilizable) */}
      <div className="flex-shrink-0 mr-3">
        <RenderJugadorFoto jugador={jugador} className="h-12 w-12" />
      </div>

      {/* Información Principal (Nombre y Posición) */}
      <div className="flex-1 min-w-0"> {/* min-w-0 para que funcione el truncate */}
        <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-600">
          {jugador.nombre} {jugador.apellido}
        </p>
        <p className="text-xs text-gray-500 truncate">
          {jugador.posicion || 'N/D'}
        </p>
      </div>

      {/* Goles (a la derecha) */}
      {(jugador.goles !== undefined && jugador.goles !== null) && ( // Mostrar solo si hay datos de goles
        <div className="flex items-center ml-4 pl-3 border-l border-gray-200 flex-shrink-0">
          <FiAward className="h-4 w-4 text-yellow-500 mr-1" />
          <span className="text-sm font-bold text-gray-700">{jugador.goles}</span>
        </div>
      )}
    </Link>
  );
}

export default JugadorCard;
