// src/pages/public/FixturePage.jsx
import React, { useState, useEffect, useMemo } from 'react'; // Añadido useMemo
import { Link } from 'react-router-dom';
import { BACKEND_ORIGIN } from '../config';
import FormatDate from '../components/FormatDate';
import { usePublic } from '../context/PublicContex'; // <-- Importamos el hook del contexto

// Opcional: Un componente de carga
// import LoadingSpinner from '../../components/LoadingSpinner';

// Función auxiliar para renderizar insignias (sin cambios)
const renderInsignia = (equipo) => {
  if (!equipo || !equipo.foto_equipo) {
    return <div className="h-6 w-6 md:h-8 md:w-8 bg-gray-300 rounded-full flex-shrink-0"></div>;
  }
  return (
    <img
      className="h-6 w-6 md:h-8 md:w-8 object-contain rounded-full flex-shrink-0"
      src={`${BACKEND_ORIGIN}/uploads/equipos/${equipo.foto_equipo.replace(/\\/g, '/')}`}
      alt={equipo.nombre}
      onError={(e) => { e.target.style.display = 'none'; }}
    />
  );
};

function FixturePage() {
  // --- Obtenemos la función y el estado del contexto ---
  const { getFechas, fechas: fechasFromContext } = usePublic(); // 'fechas' del contexto

  // --- Estados locales solo para carga y error de ESTA PÁGINA ---
  // Mantenemos esto para dar feedback al usuario mientras esta página carga,
  // incluso si los datos ya existen en el contexto por otra carga previa.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFixture = async () => {
      // Solo mostramos 'cargando' si realmente no hay datos aún en el contexto
      if (!fechasFromContext || fechasFromContext.length === 0) {
          setLoading(true);
      } else {
          setLoading(false); // Si ya hay datos, no mostramos 'cargando'
      }
      setError(null);
      try {
        // --- Llamamos a la función del contexto para asegurar que los datos estén actualizados ---
        await getFechas();
        // Los datos se actualizarán en 'fechasFromContext' automáticamente
      } catch (err) {
        console.error("Error fetching fixture via context:", err);
        setError("No se pudo cargar el fixture. Inténtalo de nuevo más tarde.");
      } finally {
        // Independientemente de si había datos antes, quitamos el estado de carga
        // una vez que el intento de fetch (o la confirmación de datos existentes) termina.
        setLoading(false);
      }
    };

    fetchFixture();
    // La dependencia es getFechas para que se ejecute si la función cambia (poco probable pero correcto)
    // y para satisfacer al linter. No necesitamos depender de fechasFromContext aquí,
    // ya que el componente se re-renderizará automáticamente cuando cambie.
  }, [getFechas]);

  // --- Usamos useMemo para ordenar las fechas obtenidas del contexto ---
  // Esto evita re-ordenar en cada renderizado si fechasFromContext no ha cambiado.
  const sortedFechas = useMemo(() => {
    if (!fechasFromContext || fechasFromContext.length === 0) return [];

    return [...fechasFromContext].sort((a, b) => {
      // Prioriza ordenar por un campo numérico como 'numero' si existe
      if (a.numero !== undefined && b.numero !== undefined) {
        return a.numero - b.numero;
      }
      // Si no, ordena por fecha
      const dateA = new Date(a.fecha || 0);
      const dateB = new Date(b.fecha || 0);
      return dateA - dateB;
    });
  }, [fechasFromContext]); // Depende de los datos del contexto

  // --- Renderizado Condicional (Usa estados locales y datos del contexto ordenados) ---
  if (loading) {
    return <div className="text-center py-10">Cargando fixture...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  // Usamos sortedFechas (los datos ordenados del contexto)
  if (sortedFechas.length === 0) {
    return <div className="text-center py-10 text-gray-500">No hay fechas de fixture disponibles.</div>;
  }

  // --- Renderizado Principal (Usa sortedFechas) ---
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-violet-800 mb-8 text-center">Fixture del Torneo</h1>

      <div className="space-y-8">
        {/* Mapeamos sobre las fechas ordenadas del contexto */}
        {sortedFechas.map((fecha) => (
          <div key={fecha._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Encabezado de la Fecha/Ronda */}
            <div className="bg-gray-100 p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-700">
                {fecha.nombre || `Fecha ${fecha.numero || ''}`}
              </h2>
              {fecha.fecha && (
                <p className="text-sm text-gray-500">
                  <FormatDate date={fecha.fecha} />
                </p>
              )}
            </div>

            {/* Lista de Partidos de la Fecha */}
            <div className="divide-y divide-gray-100">
              {!fecha.partidos || fecha.partidos.length === 0 ? (
                <p className="p-4 text-sm text-gray-500 italic">No hay partidos programados para esta fecha.</p>
              ) : (
                fecha.partidos.map((partido) => (
                  <div key={partido._id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-150">

                    {/* Equipo Local */}
                    <div className="flex-1 flex items-center justify-end space-x-2 md:space-x-4 text-right">
                      <Link to={`/web/equipos/${partido.equipo_local?._id}`} className="text-sm md:text-base font-medium text-gray-800 hover:text-blue-600 truncate">
                        {partido.equipo_local?.nombre || 'Local'}
                      </Link>
                      {renderInsignia(partido.equipo_local)}
                    </div>

                    {/* Marcador o VS */}
                    <div className="w-16 md:w-24 text-center px-2">
                      {partido.estado === 'Finalizado' ? (
                        <span className="text-lg md:text-xl font-bold text-gray-800">
                          {partido.marcador_local ?? '-'} : {partido.marcador_visitante ?? '-'}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-500 uppercase font-semibold">vs</span>
                      )}
                       {partido.estado !== 'Finalizado' && (
                         <span className="block text-xs text-gray-400 mt-1">{partido.estado || 'Pendiente'}</span>
                       )}
                    </div>

                    {/* Equipo Visitante */}
                    <div className="flex-1 flex items-center justify-start space-x-2 md:space-x-4 text-left">
                      {renderInsignia(partido.equipo_visitante)}
                      <Link to={`/web/equipos/${partido.equipo_visitante?._id}`} className="text-sm md:text-base font-medium text-gray-800 hover:text-blue-600 truncate">
                        {partido.equipo_visitante?.nombre || 'Visitante'}
                      </Link>
                    </div>

                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FixturePage;
