// src/pages/public/FixturePage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BACKEND_ORIGIN } from '../config';
import FormatDate from '../components/FormatDate';
import { usePublic } from '../context/PublicContex';
import EspacioPublicidad from '../components/public/EspacioPublicidad'; // Asegúrate que la importación está

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
  // --- Obtenemos la función y el estado del contexto (sin cambios) ---
  const { getFechas, fechas: fechasFromContext } = usePublic();

  // --- Estados locales solo para carga y error de ESTA PÁGINA (sin cambios) ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- useEffect para Cargar Datos (sin cambios) ---
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
  }, [getFechas]);

  // --- Usamos useMemo para ordenar las fechas obtenidas del contexto (sin cambios) ---
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

  // --- Renderizado Condicional (sin cambios) ---
  if (loading) {
    return <div className="text-center py-10">Cargando fixture...</div>;
  }
  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }
  if (sortedFechas.length === 0) {
    return <div className="text-center py-10 text-gray-500">No hay fechas de fixture disponibles.</div>;
  }

  // --- Renderizado Principal (Estructura modificada como GoleadoresPage) ---
  return (
    // Contenedor principal: Quitamos el grid de aquí
    <div className="container mx-auto px-4 py-8 md:py-12">

      {/* Título: Ocupa todo el ancho, centrado */}
      <h1 className="text-3xl md:text-4xl font-bold text-center text-violet-800 mb-8 md:mb-12">
        Fixture del Torneo
      </h1>

      {/* Nuevo Contenedor Grid: Aplicamos el grid 10/2 aquí, solo en pantallas grandes */}
      <div className="lg:grid lg:grid-cols-12 lg:gap-8">

        {/* Columna Izquierda (Contenido del Fixture) */}
        {/* Ocupa 10 de 12 columnas en pantallas grandes */}
        <div className="lg:col-span-10">
          {/* Mantenemos el div que agrupa las fechas */}
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

                {/* Lista de Partidos de la Fecha (sin cambios internos) */}
                <div className="divide-y divide-gray-100">
                  {!fecha.partidos || fecha.partidos.length === 0 ? (
                    <p className="p-4 text-sm text-gray-500 italic">No hay partidos programados para esta fecha.</p>
                  ) : (
                    fecha.partidos.map((partido) => (
                      // Contenedor principal del partido, con padding y efecto hover. El borde lo maneja `divide-y` del padre.
                      <div key={partido._id} className="p-3 md:p-4 hover:bg-gray-50 transition-colors duration-150">
                        {/* Contenedor flex: se apila en móvil (flex-col), fila en pantallas pequeñas y mayores (sm:flex-row) */}
                        {/* items-center para alinear verticalmente en modo fila, sm:justify-between para espaciar en modo fila */}
                        <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-2 sm:gap-3">

                        {/* Equipo Local */}
                          {/* En móvil: ocupa el ancho, el contenido se alinea a la izquierda. */}
                          {/* En sm+: toma 2/5 del ancho, el contenido se alinea a la derecha, nombre antes de la insignia. */}
                          <div className="flex items-center w-full sm:w-2/5 space-x-2 md:space-x-3 justify-start sm:justify-end sm:order-1">
                            <Link to={`/web/equipos/${partido.equipo_local?._id}`} className="text-sm md:text-base font-medium text-gray-800 hover:text-blue-600 break-words text-left sm:text-right sm:order-1">
                            {partido.equipo_local?.nombre || 'Local'}
                          </Link>
                            <div className="flex-shrink-0 sm:order-2">{renderInsignia(partido.equipo_local)}</div> {/* Insignia a la derecha del nombre en sm+ */}
                        </div>

                        {/* Marcador o VS */}
                          {/* En móvil: ocupa el ancho, centrado. En sm+: ancho automático, centrado. Ordenado entre los equipos. */}
                          <div className="w-full sm:w-auto text-center py-1 sm:py-0 sm:order-2">
                          {partido.estado === 'Finalizado' ? (
                              <span className="text-base md:text-lg font-bold text-gray-800">
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
                          {/* En móvil: ocupa el ancho, insignia antes del nombre. */}
                          {/* En sm+: toma 2/5 del ancho, insignia antes del nombre. */}
                          <div className="flex items-center w-full sm:w-2/5 space-x-2 md:space-x-3 justify-start sm:order-3">
                            <div className="flex-shrink-0">{renderInsignia(partido.equipo_visitante)}</div> {/* Insignia a la izquierda del nombre */}
                            <Link to={`/web/equipos/${partido.equipo_visitante?._id}`} className="text-sm md:text-base font-medium text-gray-800 hover:text-blue-600 break-words text-left">
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
        </div> {/* Fin de la Columna Izquierda (Contenido) */}

       {/* Columna Derecha (Publicidad) */}
        {/* --- MODIFICADO AQUÍ --- */}
        {/* Por defecto (móvil): grid de 2 columnas con gap */}
        {/* En lg: se convierte en columna de 2/12, flex vertical con space-y */}
        <div className="grid grid-cols-2 gap-4 items-start mt-8 lg:col-span-2 lg:flex lg:flex-col lg:space-y-8 lg:mt-0">

           {/* Anuncio 1 */}
           {/* Ya no necesita w-full o max-w-sm explícito para móvil (grid lo maneja) */}
           {/* Mantenemos w-full para lg (para que ocupe el ancho de la columna flex) */}
           <div className="lg:w-full">
             <EspacioPublicidad
                imagenSrc="/imagenes/imagen_01.jpg" // ¡Verifica ruta!
                altPublicidad="Anuncio de Ejemplo 1"
              />
           </div>

           {/* Anuncio 2 */}
           <div className="lg:w-full">
              <EspacioPublicidad
                imagenSrc="/imagenes/imagen_02.jpg" // ¡Verifica ruta!
                altPublicidad="Anuncio de Ejemplo 2"
              />
           </div>

           {/* Anuncio 3 */}
           <div className="lg:w-full">
              <EspacioPublicidad
                imagenSrc="/imagenes/imagen_03.jpg" // ¡Verifica ruta!
                altPublicidad="Anuncio de Ejemplo 3"
              />
           </div>

           {/* Anuncio 4 */}
           <div className="lg:w-full">
               <EspacioPublicidad
                imagenSrc="/imagenes/imagen_04.jpg" // ¡Verifica ruta!
                altPublicidad="Anuncio de Ejemplo 4"
              />
           </div>
           {/* Puedes añadir más anuncios si es necesario */}

        </div> {/* Fin Columna Derecha (Publicidad) */}

      </div> {/* Fin Contenedor Grid Principal */}

    </div> // Fin contenedor principal
  );
}

export default FixturePage;