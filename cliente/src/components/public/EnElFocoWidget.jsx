// src/components/public/EnElFocoWidget.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BACKEND_ORIGIN } from '../../config';
import FormatDate from '../FormatDate'; // Reutilizamos el formateador

function EnElFocoWidget({ partidos }) {
  const [partidoDestacado, setPartidoDestacado] = useState(null);
  const [esProximo, setEsProximo] = useState(true); // Para saber si mostramos "Próximo" o "Último"

  useEffect(() => {
    if (!partidos || partidos.length === 0) return;

    const ahora = new Date();
    // Ordenar partidos: primero los pendientes por fecha asc, luego los finalizados por fecha desc
    const partidosOrdenados = [...partidos].sort((a, b) => {
      if (a.estado === 'Pendiente' && b.estado !== 'Pendiente') return -1;
      if (a.estado !== 'Pendiente' && b.estado === 'Pendiente') return 1;
      if (a.estado === 'Pendiente') { // Ambos pendientes, ordenar por fecha asc
        return new Date(a.fecha?.fecha || 0) - new Date(b.fecha?.fecha || 0);
      } else { // Ambos finalizados (o cualquier otro estado), ordenar por fecha desc
        return new Date(b.fecha?.fecha || 0) - new Date(a.fecha?.fecha || 0);
      }
    });

    // Buscar el próximo partido pendiente
    const proximo = partidosOrdenados.find(p => p.estado === 'Pendiente' && new Date(p.fecha?.fecha || 0) >= ahora);

    if (proximo) {
      setPartidoDestacado(proximo);
      setEsProximo(true);
    } else {
      // Si no hay próximo, buscar el último finalizado
      const ultimoFinalizado = partidosOrdenados.find(p => p.estado === 'Finalizado');
      if (ultimoFinalizado) {
        setPartidoDestacado(ultimoFinalizado);
        setEsProximo(false);
      } else {
        setPartidoDestacado(null); // No hay ni próximo ni último
      }
    }

  }, [partidos]);

  const renderInsignia = (equipo) => {
    //console.log(equipo);
    if (!equipo || !equipo.foto_equipo) return <div className="h-12 w-12 md:h-16 md:w-16 bg-gray-300 rounded-full flex items-center justify-center text-xs">{equipo.foto_equipo}</div>;
    return (
      <img
        className="h-12 w-12 md:h-16 md:w-16 object-contain rounded-full bg-white p-1 shadow"
        src={`${BACKEND_ORIGIN}/uploads/equipos/${equipo.foto_equipo}`}
        alt={equipo.nombre}
        onError={(e) => e.target.style.display = 'none'}
      />
    );
  };

  if (!partidoDestacado) {
    return (
      <div className="bg-white rounded-lg shadow p-4 text-center text-gray-500 italic">
        No hay información de partidos disponible.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <h3 className="text-lg font-semibold">{esProximo ? 'Próximo Partido' : 'Último Resultado'}</h3>
      </div>
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-around text-center mb-4">
          {/* Equipo Local */}
          <div className="flex flex-col items-center w-1/3">
            {renderInsignia(partidoDestacado.equipo_local)}
            <span className="mt-2 text-sm md:text-base font-medium text-gray-800 truncate w-full">{partidoDestacado.equipo_local?.nombre || 'N/A'}</span>
          </div>

          {/* Marcador o Fecha */}
          <div className="flex flex-col items-center text-center px-2">
            {esProximo ? (
              <>
                <span className="text-xs text-gray-500 uppercase">vs</span>
                <span className="text-sm font-semibold text-gray-700 mt-1">
                  <FormatDate date={partidoDestacado.fecha?.fecha} fallback="Fecha Pendiente" />
                </span>
                {/* Podrías añadir hora si la tienes */}
              </>
            ) : (
              <span className="text-2xl md:text-3xl font-bold text-gray-800">
                {partidoDestacado.marcador_local ?? '-'} : {partidoDestacado.marcador_visitante ?? '-'}
              </span>
            )}
          </div>

          {/* Equipo Visitante */}
          <div className="flex flex-col items-center w-1/3">
            {renderInsignia(partidoDestacado.equipo_visitante)}
            <span className="mt-2 text-sm md:text-base font-medium text-gray-800 truncate w-full">{partidoDestacado.equipo_visitante?.nombre || 'N/A'}</span>
          </div>
        </div>
        <div className="text-center mt-4">
          <Link
            to="/calendario" // Asume ruta /calendario para ver todos
            className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
          >
            Ver Calendario Completo →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EnElFocoWidget;
