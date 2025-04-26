// src/components/public/TopGoleadores.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BACKEND_ORIGIN } from '../../config';

function TopGoleadores({ jugadores }) {
  const [topGoleadores, setTopGoleadores] = useState([]);
 ///console.log("Jugadores (prop):", jugadores);
  useEffect(() => {
    if (jugadores) {
      const sorted = [...jugadores]
        .filter(j => (j.goles ?? 0) > 0) // Solo jugadores con goles
        .sort((a, b) => (b.goles ?? 0) - (a.goles ?? 0)); // Ordenar por goles desc
      setTopGoleadores(sorted.slice(0, 5)); // Tomar los primeros 5
    }
  }, [jugadores]);

  // Dentro de TopGoleadores.jsx

const renderFoto = (jugador) => {
  if (!jugador || !jugador.foto_jug) {
    return (
      <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 text-xl font-semibold flex-shrink-0">
        {jugador && jugador.nombre ? jugador.nombre[0].toUpperCase() : '?'}
      </div>
    );
  }
  return (
    <img
      className="h-10 w-10 object-cover rounded-full flex-shrink-0"
      src={`${BACKEND_ORIGIN}/uploads/jugadores/${jugador.foto_jug}`}
      alt={`${jugador.nombre} ${jugador.apellido}`}
      onError={(e) => e.target.style.display = 'none'}
    />
  );
};

// ... resto del componente TopGoleadores ...

  const renderInsigniaEquipo = (equipo) => {
    if (!equipo || !equipo.foto_equipo) return null;
    return (
      <img
        className="h-4 w-4 object-contain inline-block ml-1 rounded-full"
        src={`${BACKEND_ORIGIN}/uploads/equipos/${equipo.foto_equipo}`}
        alt={equipo.nombre}
        title={equipo.nombre}
        onError={(e) => e.target.style.display = 'none'}
      />
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-3 text-gray-700">Máximos Goleadores</h3>
      {topGoleadores.length > 0 ? (
        <ul className="space-y-3">
          {topGoleadores.map((jugador, index) => (
            <li key={jugador._id} className="flex items-center justify-between text-sm border-b border-gray-100 pb-2 last:border-b-0">
              <div className="flex items-center space-x-2 overflow-hidden">
                <span className="font-semibold w-5 text-gray-500">{index + 1}.</span>
                {renderFoto(jugador)}
                <div className="overflow-hidden">
                  <Link to={`/jugadores/${jugador._id}`} className="font-medium text-gray-800 hover:text-blue-600 block truncate">
                    {jugador.nombre} {jugador.apellido}
                  </Link>
                  <span className="text-xs text-gray-500 block">
                    {jugador.equip ? renderInsigniaEquipo(jugador.equip) : 'Sin equipo'}
                  </span>
                </div>
              </div>
              <span className="font-bold text-lg text-blue-600 flex-shrink-0 pl-2">{jugador.goles ?? 0}</span>
            </li>
          ))}
          <li className="pt-2 text-right">
            <Link to="/estadisticas" className="text-blue-600 hover:text-blue-800 text-xs font-semibold">
              Ver Ranking Completo →
            </Link>
          </li>
        </ul>
      ) : (
        <p className="text-sm text-gray-500 italic">No hay goleadores registrados.</p>
      )}
    </div>
  );
}

export default TopGoleadores;
