// cliente/src/pages/GoleadoresPage.jsx
import React, { useState, useEffect } from 'react';
import JugadorCard from '../components/public/JugadorCard'; // Asegúrate que la ruta sea correcta
import { usePublic } from "../context/PublicContex"; // Asegúrate que la ruta sea correcta
import LoadingSpinner from '../components/LoadingSpinner'; // Asegúrate que la ruta sea correcta

function GoleadoresPage() {
  // --- Obtener datos y función del contexto ---
  // Asume que 'goleador' en el contexto es un objeto: { jugadores: [], totalJugadores: 0 }
  const { goleador, getgoleadores } = usePublic();

  // --- Declaraciones de Estado Local (ANTES de usarlas) ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const limit = 20; // Límite de items por página

  // --- useEffect para Cargar Datos ---
  useEffect(() => {
    async function cargarGoleadores() {
      setLoading(true); // Iniciar carga
      setError(null);   // Limpiar errores previos
      try {
        await getgoleadores(); // Llamar a la función del contexto
      } catch (err) {
        console.error("Error en GoleadoresPage al llamar a getgoleadores:", err);
        setError("No se pudieron cargar los goleadores. Intenta de nuevo más tarde.");
      } finally {
        setLoading(false); // Finalizar carga (éxito o fallo)
      }
    }
    cargarGoleadores();
  }, [getgoleadores]); // Dependencia: la función del contexto

  // --- Procesamiento de Datos ---
  // 1. Extraer la lista completa del objeto 'goleador'
  const listaCompletaGoleadores = goleador || [];

  // 2. Filtrar por término de búsqueda
  const goleadoresOrdenados = [...listaCompletaGoleadores].sort(
    (a, b) => (b.goles ?? 0) - (a.goles ?? 0) // Ordena de mayor a menor goles
  );
  const jugadoresFiltrados = goleadoresOrdenados.filter((jugador) => // <-- Ahora filtra sobre goleadoresOrdenados
    `${jugador.nombre} ${jugador.apellido}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 3. Aplicar paginación simulada (slice)
  const jugadoresMostrados = jugadoresFiltrados.slice(0, offset + limit);

  // 4. Determinar si hay más para mostrar
  const hasMore = jugadoresMostrados.length < jugadoresFiltrados.length;

  // --- Manejadores de Eventos ---
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setOffset(0); // Resetear paginación al buscar
  };

  const handleVerMas = () => {
    setOffset((prevOffset) => prevOffset + limit);
  };

  // --- Renderizado ---
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-violet-800 mb-8 md:mb-12">
        Máximos Goleadores
      </h1>

      {/* Input de Búsqueda */}
      <div className="mb-8 max-w-lg mx-auto">
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
        <div className="space-y-4 max-w-3xl mx-auto"> {/* Contenedor para las cards */}
          {/* Mapear sobre los jugadores a MOSTRAR */}
          {jugadoresMostrados.map((jugador) => (
            <JugadorCard key={jugador._id} jugador={jugador} />
          ))}
        </div>
      )}

      {/* Mensajes de "no encontrado" o "no hay" */}
      {!loading && !error && jugadoresFiltrados.length === 0 && searchTerm && (
         <p className="text-center text-gray-500 italic mt-8">No se encontraron jugadores que coincidan con "{searchTerm}".</p>
      )}
      {!loading && !error && jugadoresFiltrados.length === 0 && !searchTerm && (
         <p className="text-center text-gray-500 italic mt-8">Aún no hay goleadores registrados.</p>
      )}

      {/* Botón "Ver más" */}
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

      {/* Mensaje "No hay más" */}
      {!loading && !hasMore && jugadoresFiltrados.length > 0 && (
           <p className="text-center text-gray-500 italic mt-8">No hay más goleadores para mostrar.</p>
       )}
    </div>
  );
}

export default GoleadoresPage;
