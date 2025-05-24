// src/pages/public/FixturePage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BACKEND_ORIGIN } from '../config';
import FormatDate from '../components/FormatDate';
import { usePublic } from '../context/PublicContex';
import EspacioPublicidad from '../components/public/EspacioPublicidad'; // Asegúrate que la importación está

// Opcional: Un componente de carga
// import LoadingSpinner from '../../components/LoadingSpinner';

// Función auxiliar para renderizar insignias
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
  const { getFechas, fechas: fechasFromContext } = usePublic();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFixture = async () => {
      if (!fechasFromContext || fechasFromContext.length === 0) {
          setLoading(true);
      } else {
          setLoading(false);
      }
      setError(null);
      try {
        await getFechas();
      } catch (err) {
        console.error("Error fetching fixture via context:", err);
        setError("No se pudo cargar el fixture. Inténtalo de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };
    fetchFixture();
  }, [getFechas, fechasFromContext]); // Agregado fechasFromContext a las dependencias

  const sortedFechas = useMemo(() => {
    if (!fechasFromContext || fechasFromContext.length === 0) return [];
    return [...fechasFromContext].sort((a, b) => {
      if (a.numero !== undefined && b.numero !== undefined) {
        return a.numero - b.numero;
      }
      const dateA = new Date(a.fecha || 0);
      const dateB = new Date(b.fecha || 0);
      return dateA - dateB;
    });
  }, [fechasFromContext]);

  if (loading) {
    return <div className="text-center py-10">Cargando fixture...</div>;
  }
  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }
  if (sortedFechas.length === 0) {
    return <div className="text-center py-10 text-gray-500">No hay fechas de fixture disponibles.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-violet-800 mb-8 md:mb-12">
        Fixture del Torneo
      </h1>
      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-10">
          <div className="space-y-8">
            {sortedFechas.map((fecha) => (
              <div key={fecha._id} className="bg-white rounded-lg shadow-md overflow-hidden">
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
                <div className="divide-y divide-gray-100">
                  {!fecha.partidos || fecha.partidos.length === 0 ? (
                    <p className="p-4 text-sm text-gray-500 italic">No hay partidos programados para esta fecha.</p>
                  ) : (
                    fecha.partidos.map((partido) => (
                      // Contenedor principal del partido:
                      // Móvil: se apilan verticalmente (flex-col)
                      // Desktop (md): se ponen en fila (md:flex-row) y se estiran para igualar altura (md:items-stretch)
                      <div key={partido._id} className="p-3 md:p-4 hover:bg-gray-50 transition-colors duration-150 flex flex-col md:flex-row md:items-stretch">

                        {/* Equipo Local */}
                        {/* Móvil: se centra el contenido. Desktop: contenido a la derecha. */}
                        <div className="w-full md:w-2/5 flex flex-col items-center justify-center md:items-end md:justify-center p-2 text-center md:text-right mb-2 md:mb-0">
                          <Link
                            to={`/web/equipos/${partido.equipo_local?._id}`}
                            className="text-sm md:text-base font-semibold text-gray-800 hover:text-blue-600 break-words w-full" // break-words para nombres largos
                          >
                            {partido.equipo_local?.nombre || 'Local'}
                          </Link>
                          <div className="mt-1 md:mt-2"> {/* Espacio entre nombre e insignia */}
                            {renderInsignia(partido.equipo_local)}
                          </div>
                        </div>

                        {/* Marcador o VS - Columna Central (20% en desktop) */}
                        {/* Móvil: se centra. Desktop: se centra vertical y horizontalmente. */}
                        <div className="w-full md:w-1/5 flex flex-col items-center justify-center text-center p-2 mb-2 md:mb-0">
                          {partido.estado === 'Finalizado' ? (
                            <span className="text-base md:text-lg font-bold text-gray-800">
                              {partido.marcador_local ?? '-'} : {partido.marcador_visitante ?? '-'}
                            </span>
                          ) : (
                            <span className="text-sm md:text-base text-gray-500 uppercase font-semibold">vs</span>
                          )}
                           {partido.estado !== 'Finalizado' && (
                             <span className="block text-xs text-gray-400 mt-1 capitalize">{partido.estado || 'Pendiente'}</span>
                           )}
                        </div>

                        {/* Equipo Visitante */}
                        {/* Móvil: se centra el contenido. Desktop: contenido a la izquierda. */}
                        <div className="w-full md:w-2/5 flex flex-col items-center justify-center md:items-start md:justify-center p-2 text-center md:text-left">
                           <Link
                            to={`/web/equipos/${partido.equipo_visitante?._id}`}
                            className="text-sm md:text-base font-semibold text-gray-800 hover:text-blue-600 break-words w-full" // break-words para nombres largos
                          >
                            {partido.equipo_visitante?.nombre || 'Visitante'}
                          </Link>
                          <div className="mt-1 md:mt-2"> {/* Espacio entre nombre e insignia */}
                            {renderInsignia(partido.equipo_visitante)}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 items-start mt-8 lg:col-span-2 lg:flex lg:flex-col lg:space-y-8 lg:mt-0">
           <div className="lg:w-full">
             <EspacioPublicidad
                imagenSrc="/imagenes/imagen_01.jpg"
                altPublicidad="Anuncio de Ejemplo 1"
              />
           </div>
           <div className="lg:w-full">
              <EspacioPublicidad
                imagenSrc="/imagenes/imagen_02.jpg"
                altPublicidad="Anuncio de Ejemplo 2"
              />
           </div>
           <div className="lg:w-full">
              <EspacioPublicidad
                imagenSrc="/imagenes/imagen_03.jpg"
                altPublicidad="Anuncio de Ejemplo 3"
              />
           </div>
           <div className="lg:w-full">
               <EspacioPublicidad
                imagenSrc="/imagenes/imagen_04.jpg"
                altPublicidad="Anuncio de Ejemplo 4"
              />
           </div>
        </div>
      </div>
    </div>
  );
}

export default FixturePage;
