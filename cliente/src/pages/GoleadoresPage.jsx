// cliente/src/pages/GoleadoresPage.jsx
import React, { useState, useEffect } from 'react';
import JugadorCard from '../components/public/JugadorCard';
import { usePublic } from "../context/PublicContex";
import LoadingSpinner from '../components/LoadingSpinner';
import EspacioPublicidad from '../components/public/EspacioPublicidad';

function GoleadoresPage() {
  // --- Obtener datos y función del contexto (sin cambios) ---
  const { goleador, getgoleadores } = usePublic();

  // --- Declaraciones de Estado Local (sin cambios) ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const limit = 20;

  // --- useEffect para Cargar Datos (sin cambios) ---
  useEffect(() => {
    async function cargarGoleadores() {
      setLoading(true);
      setError(null);
      try {
        await getgoleadores();
      } catch (err) {
        console.error("Error en GoleadoresPage al llamar a getgoleadores:", err);
        setError("No se pudieron cargar los goleadores. Intenta de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    }
    cargarGoleadores();
  }, [getgoleadores]);

  // --- Procesamiento de Datos (sin cambios) ---
  const listaCompletaGoleadores = goleador || [];
  const goleadoresOrdenados = [...listaCompletaGoleadores].sort(
    (a, b) => (b.goles ?? 0) - (a.goles ?? 0)
  );
  const jugadoresFiltrados = goleadoresOrdenados.filter((jugador) =>
    `${jugador.nombre} ${jugador.apellido}`.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const jugadoresMostrados = jugadoresFiltrados.slice(0, offset + limit);
  const hasMore = jugadoresMostrados.length < jugadoresFiltrados.length;

  // --- Manejadores de Eventos (sin cambios) ---
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setOffset(0);
  };
  const handleVerMas = () => {
    setOffset((prevOffset) => prevOffset + limit);
  };

  // --- Renderizado ---
  return (
    // Contenedor principal: Quitamos el grid de aquí
    <div className="container mx-auto px-4 py-8 md:py-12">

      {/* Título: Ocupa todo el ancho por defecto, centrado */}
      <h1 className="text-3xl md:text-4xl font-bold text-center text-violet-800 mb-8 md:mb-12">
        Máximos Goleadores
      </h1>

      {/* Nuevo Contenedor Grid: Aplicamos el grid 10/2 aquí, solo en pantallas grandes */}
      <div className="lg:grid lg:grid-cols-12 lg:gap-8">

        {/* Columna Izquierda (Contenido: Buscador + Lista) */}
        {/* Ocupa 10 de 12 columnas en pantallas grandes */}
        <div className="lg:col-span-10">

          {/* Input de Búsqueda */}
          <div className="mb-8 max-w-full lg:max-w-lg"> {/* Mantenemos max-w aquí si quieres limitar el buscador */}
            <input
              type="text"
              placeholder="Buscar jugador por nombre o apellido..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Estado de Carga */}
          {loading && (
            <div className="flex justify-center items-center min-h-[200px]">
              <LoadingSpinner />
            </div>
          )}

          {/* Estado de Error */}
          {error && !loading && (
            <div className="text-center text-red-600 bg-red-100 border border-red-400 rounded p-4 max-w-lg mx-auto">
              <p><strong>Error:</strong> {error}</p>
            </div>
          )}

          {/* Contenido Principal: Lista de Jugadores */}
          {!loading && !error && (
            <div className="space-y-4">
              {jugadoresMostrados.map((jugador) => (
                <JugadorCard key={jugador._id} jugador={jugador} />
              ))}
            </div>
          )}

          {/* Mensajes y Botón "Ver más" */}
          {!loading && !error && jugadoresFiltrados.length === 0 && searchTerm && (
             <p className="text-center text-gray-500 italic mt-8">No se encontraron jugadores que coincidan con "{searchTerm}".</p>
          )}
          {!loading && !error && jugadoresFiltrados.length === 0 && !searchTerm && (
             <p className="text-center text-gray-500 italic mt-8">Aún no hay goleadores registrados.</p>
          )}
          {!loading && hasMore && (
            <div className="text-center mt-8">
              <button
                onClick={handleVerMas}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
              >
                Ver más
              </button>
            </div>
          )}
          {!loading && !hasMore && jugadoresFiltrados.length > 0 && (
               <p className="text-center text-gray-500 italic mt-8">No hay más goleadores para mostrar.</p>
           )}

        </div> {/* Fin de la Columna Izquierda (Contenido) */}

        {/* Columna Derecha (Publicidad) */}
        {/* Ocupa 2 de 12 columnas en pantallas grandes */}
        <div className="lg:col-span-2 space-y-8 flex flex-col items-center mt-8 lg:mt-0"> {/* Añadido margen superior en móvil */}
           {/* --- Anuncio 1 --- */}
           <div className="w-full max-w-sm"> {/* Mantenemos el max-w para controlar tamaño */}
             <EspacioPublicidad
                imagenSrc="/imagenes/imagen_01.jpg" // ¡Verifica esta ruta!
                altPublicidad="Anuncio de Ejemplo 1"
              />
           </div>
            {/* --- Anuncio 2 --- */}
           <div className="w-full max-w-sm">
              <EspacioPublicidad
                imagenSrc="/imagenes/imagen_02.jpg" // ¡Verifica esta ruta!
                altPublicidad="Anuncio de Ejemplo 2"
              />
           </div>
            {/* --- Anuncio 3 --- */}
           <div className="w-full max-w-sm">
              <EspacioPublicidad
                imagenSrc="/imagenes/imagen_03.jpg" // ¡Verifica esta ruta!
                altPublicidad="Anuncio de Ejemplo 3"
              />
           </div>
           {/* --- Anuncio 4 --- */}
           <div className="w-full max-w-sm">
               <EspacioPublicidad
                imagenSrc="/imagenes/imagen_04.jpg" // ¡Verifica esta ruta!
                altPublicidad="Anuncio de Ejemplo 4"
              />
           </div>
        </div> {/* Fin de la Columna Derecha (Publicidad) */}

      </div> {/* Fin del Nuevo Contenedor Grid (10/2) */}

    </div> // Fin del contenedor principal
  );
}

export default GoleadoresPage;
