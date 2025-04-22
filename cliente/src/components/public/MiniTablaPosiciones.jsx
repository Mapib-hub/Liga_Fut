// src/components/public/MiniTablaPosiciones.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BACKEND_ORIGIN } from '../../config';

function MiniTablaPosiciones({ equipos }) {
  const [topEquipos, setTopEquipos] = useState([]);

  useEffect(() => {
    if (equipos) {
      // Ordenar por puntos (desc), luego por diferencia de goles (desc), luego por goles a favor (desc)
      const sorted = [...equipos].sort((a, b) => {
        const pointsDiff = (b.puntos ?? 0) - (a.puntos ?? 0);
        if (pointsDiff !== 0) return pointsDiff;
        const gdDiff = (b.diferencia_de_goles ?? 0) - (a.diferencia_de_goles ?? 0);
        if (gdDiff !== 0) return gdDiff;
        return (b.goles_a_favor ?? 0) - (a.goles_a_favor ?? 0);
      });
      setTopEquipos(sorted.slice(0, 5)); // Tomar los primeros 5
    }
  }, [equipos]);

  const renderInsignia = (equipo) => {
    if (!equipo || !equipo.foto_equipo) return <div className="h-5 w-5 bg-gray-300 rounded-full inline-block mr-2 flex-shrink-0"></div>;
    return (
      <img
        className="h-5 w-5 object-contain inline-block mr-2 rounded-full flex-shrink-0"
        src={`${BACKEND_ORIGIN}/uploads/equipos/${equipo.foto_equipo}`}
        alt={equipo.nombre}
        onError={(e) => e.target.style.display = 'none'}
      />
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-3 text-gray-700">Tabla de Posiciones</h3>
      {topEquipos.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              {/* Asegúrate que no haya espacios entre <tr> y <th>, ni después del último <th> */}
              <tr className="text-left text-xs text-gray-500 uppercase">
                <th className="py-2 px-1 w-6">#</th>
                <th className="py-2 px-1">Equipo</th>
                <th className="py-2 px-1 text-right">Pts</th>
                <th className="py-2 px-1 text-right hidden sm:table-cell">PJ</th>
                <th className="py-2 px-1 text-right hidden md:table-cell">DG</th>
              </tr>
              {/* Sin espacios aquí tampoco */}
            </thead>
            <tbody>
              {topEquipos.map((equipo, index) => (
                <tr key={equipo._id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-1 font-semibold">{index + 1}</td>
                  <td className="py-2 px-1 flex items-center">
                    {renderInsignia(equipo)}
                    <Link to={`/equipos/${equipo._id}`} className="hover:text-blue-600 truncate font-medium">
                      {equipo.nombre}
                    </Link>
                  </td>
                  <td className="py-2 px-1 text-right font-bold">{equipo.puntos ?? 0}</td>
                  <td className="py-2 px-1 text-right hidden sm:table-cell">{equipo.partidos_jugados ?? 0}</td>
                  <td className="py-2 px-1 text-right hidden md:table-cell">{equipo.diferencia_de_goles ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-right mt-3">
            <Link to="/tabla" className="text-blue-600 hover:text-blue-800 text-xs font-semibold">
              Ver Tabla Completa →
            </Link>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic">No hay datos de clasificación.</p>
      )}
    </div>
  );
}

export default MiniTablaPosiciones;
