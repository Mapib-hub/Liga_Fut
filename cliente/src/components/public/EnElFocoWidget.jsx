// src/components/public/EnElFocoWidget.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BACKEND_ORIGIN } from '../../config';
import FormatDate from '../FormatDate'; // Asegúrate que esté importado

// --- Añade la función renderInsignia ---
const renderInsignia = (equipo) => {
  if (!equipo || !equipo.foto_equipo) {
    // Placeholder simple si no hay escudo
    return <div className="h-10 w-10 md:h-12 md:w-12 bg-gray-200 rounded-full mx-auto mb-1"></div>;
  }
  return (
    <img
      className="h-10 w-10 md:h-12 md:w-12 object-contain rounded-full mx-auto mb-1"
      src={`${BACKEND_ORIGIN}/uploads/equipos/${equipo.foto_equipo.replace(/\\/g, '/')}`}
      alt={equipo.nombre}
      title={equipo.nombre}
      onError={(e) => { e.target.style.display = 'none'; /* Ocultar si falla */ }}
    />
  );
};
// --- Fin renderInsignia ---

// La prop se llama 'partidos', pero sabemos que contiene las RONDAS/FECHAS
function EnElFocoWidget({ partidos: rondas }) {
  const [partidoDestacado, setPartidoDestacado] = useState(null);
  const [esProximo, setEsProximo] = useState(true);

  // --- PASO 1: Aplanar los partidos (sin cambios) ---
  const todosLosPartidosAplanados = useMemo(() => {
    if (!rondas || rondas.length === 0) return [];
    return rondas.flatMap(ronda =>
      (ronda.partidos || []).map(partido => ({
        ...partido,
        fechaDeLaRonda: ronda.fecha
      }))
    );
  }, [rondas]);

  // --- PASO 2: useEffect usa la lista aplanada (sin cambios) ---
  useEffect(() => {
    if (todosLosPartidosAplanados.length === 0) {
        setPartidoDestacado(null);
        return;
    }
    const ahora = new Date();
    const partidosOrdenados = [...todosLosPartidosAplanados].sort((a, b) => {
      const fechaA = new Date(a.fechaDeLaRonda || 0);
      const fechaB = new Date(b.fechaDeLaRonda || 0);
      if (a.estado === 'Pendiente' && b.estado !== 'Pendiente') return -1;
      if (a.estado !== 'Pendiente' && b.estado === 'Pendiente') return 1;
      if (a.estado === 'Pendiente') return fechaA - fechaB;
      else return fechaB - fechaA;
    });

    const proximo = partidosOrdenados.find(p =>
        p.estado === 'Pendiente' && new Date(p.fechaDeLaRonda || 0) >= ahora
    );

    if (proximo) {
      setPartidoDestacado(proximo);
      setEsProximo(true);
    } else {
      const ultimoFinalizado = partidosOrdenados.find(p => p.estado === 'Finalizado');
      if (ultimoFinalizado) {
        setPartidoDestacado(ultimoFinalizado);
        setEsProximo(false);
      } else {
        setPartidoDestacado(null);
      }
    }
  }, [todosLosPartidosAplanados]);

  // --- Renderizado Condicional si no hay partido ---
  if (!partidoDestacado) {
    return (
      <div className="bg-white rounded-lg shadow p-4 text-center text-gray-500 italic">
        No hay información de partidos disponible.
      </div>
    );
  }

  // --- Log para depurar el partido seleccionado -
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Header del Widget */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-3">
        <h3 className="text-lg font-semibold text-white text-center">En el Foco</h3>
      </div>

      {/* Contenido del Partido */}
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-around text-center mb-4">

          {/* --- EQUIPO LOCAL --- */}
          <div className="w-1/3 px-1">
            {renderInsignia(partidoDestacado.equipo_local)}
            <span className="block text-sm md:text-base font-medium text-gray-800 truncate">
              {partidoDestacado.equipo_local?.nombre || 'Local'}
            </span>
          </div>
          {/* --- FIN EQUIPO LOCAL --- */}

          {/* --- CENTRO (Fecha/Hora o Marcador) --- */}
          <div className="flex flex-col items-center text-center px-2">
            {esProximo ? (
              <>
                <span className="text-xs text-gray-500 uppercase">vs</span>
                <span className="text-sm font-semibold text-gray-700 mt-1">
                  {/* Usa fechaDeLaRonda con FormatDate */}
                  <FormatDate date={partidoDestacado.fechaDeLaRonda} fallback="Fecha Pendiente" />
                </span>
                {/* Opcional: Añadir hora si la tienes */}
                {/* <span className="text-xs text-gray-500">18:00</span> */}
              </>
            ) : (
              <span className="text-2xl md:text-3xl font-bold text-gray-800">
                {partidoDestacado.marcador_local ?? '-'} : {partidoDestacado.marcador_visitante ?? '-'}
              </span>
            )}
          </div>
          {/* --- FIN CENTRO --- */}

          {/* --- EQUIPO VISITANTE --- */}
          <div className="w-1/3 px-1">
            {renderInsignia(partidoDestacado.equipo_visitante)}
            <span className="block text-sm md:text-base font-medium text-gray-800 truncate">
              {partidoDestacado.equipo_visitante?.nombre || 'Visitante'}
            </span>
          </div>
          {/* --- FIN EQUIPO VISITANTE --- */}

        </div>

        {/* Link a Calendario */}
        <div className="text-center mt-4">
          <Link to="/web/fixture" className="text-blue-600 hover:text-blue-800 text-xs font-semibold">
            Ver Calendario Completo →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EnElFocoWidget;
