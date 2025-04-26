// src/pages/TablaPosicionesPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { usePublic } from '../context/PublicContex'; // Ajusta la ruta si es necesario
import { BACKEND_ORIGIN } from '../config';
import LoadingSpinner from '../components/LoadingSpinner'; // Ajusta la ruta si es necesario

// Función auxiliar para renderizar insignias (similar a MiniTablaPosiciones)
const renderInsignia = (equipo) => {
  if (!equipo || !equipo.foto_equipo) {
    return <div className="h-6 w-6 bg-gray-200 rounded-full inline-block mr-2 flex-shrink-0"></div>;
  }
  return (
    <img
      className="h-6 w-6 object-contain inline-block mr-2 rounded-full flex-shrink-0"
      src={`${BACKEND_ORIGIN}/uploads/equipos/${equipo.foto_equipo.replace(/\\/g, '/')}`}
      alt={equipo.nombre}
      onError={(e) => { e.target.style.display = 'none'; }}
      loading="lazy"
    />
  );
};

function TablaPosicionesPage() {
  // Obtenemos la función y el estado del contexto
  const { getEquipos, equipos: equiposFromContext } = usePublic();

  // Estados locales para carga y error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect para cargar los equipos al montar
  useEffect(() => {
    const fetchEquipos = async () => {
      setLoading(true);
      setError(null);
      try {
        await getEquipos(); // Llama a la función del contexto
      } catch (err) {
        console.error("Error en TablaPosicionesPage al llamar a getEquipos:", err);
        setError("No se pudo cargar la tabla de posiciones.");
      } finally {
        setLoading(false);
      }
    };
    fetchEquipos();
  }, [getEquipos]); // Dependencia

  // useMemo para ordenar los equipos solo cuando cambien los datos del contexto
  const equiposOrdenados = useMemo(() => {
    if (!equiposFromContext || equiposFromContext.length === 0) {
      return [];
    }
    // Ordenar por: Puntos (desc), DG (desc), GF (desc)
    return [...equiposFromContext].sort((a, b) => {
      const pointsDiff = (b.puntos ?? 0) - (a.puntos ?? 0);
      if (pointsDiff !== 0) return pointsDiff;
      const gdDiff = (b.diferencia_de_goles ?? 0) - (a.diferencia_de_goles ?? 0);
      if (gdDiff !== 0) return gdDiff;
      return (b.goles_a_favor ?? 0) - (a.goles_a_favor ?? 0);
    });
  }, [equiposFromContext]); // Se recalcula si equiposFromContext cambia

  // Renderizado Condicional
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-600">
        <p><strong>Error:</strong> {error}</p>
      </div>
    );
  }

  // Renderizado de la Tabla
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-violet-800 mb-8 md:mb-12">
        Tabla de Posiciones
      </h1>

      {equiposOrdenados.length > 0 ? (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-3 py-3 w-10 text-center">#</th>
                  <th scope="col" className="px-4 py-3">Equipo</th>
                  <th scope="col" className="px-3 py-3 text-center">Pts</th>
                  <th scope="col" className="px-3 py-3 text-center">PJ</th>
                  <th scope="col" className="px-3 py-3 text-center hidden sm:table-cell">PG</th>
                  <th scope="col" className="px-3 py-3 text-center hidden sm:table-cell">PE</th>
                  <th scope="col" className="px-3 py-3 text-center hidden sm:table-cell">PP</th>
                  <th scope="col" className="px-3 py-3 text-center hidden md:table-cell">GF</th>
                  <th scope="col" className="px-3 py-3 text-center hidden md:table-cell">GC</th>
                  <th scope="col" className="px-3 py-3 text-center hidden md:table-cell">DG</th>
                </tr>
              </thead>
              <tbody>
                {equiposOrdenados.map((equipo, index) => (
                  <tr key={equipo._id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-3 py-3 font-medium text-gray-900 text-center">{index + 1}</td>
                    <td className="px-4 py-3 flex items-center">
                      {renderInsignia(equipo)}
                      <Link to={`/web/equipos/${equipo._id}`} className="hover:text-blue-600 font-medium truncate">
                        {equipo.nombre}
                      </Link>
                    </td>
                    <td className="px-3 py-3 text-center font-bold">{equipo.puntos ?? 0}</td>
                    <td className="px-3 py-3 text-center">{equipo.partidos_jugados ?? 0}</td>
                    <td className="px-3 py-3 text-center hidden sm:table-cell">{equipo.victorias ?? 0}</td>
                    <td className="px-3 py-3 text-center hidden sm:table-cell">{equipo.empates ?? 0}</td>
                    <td className="px-3 py-3 text-center hidden sm:table-cell">{equipo.derrotas ?? 0}</td>
                    <td className="px-3 py-3 text-center hidden md:table-cell">{equipo.goles_a_favor ?? 0}</td>
                    <td className="px-3 py-3 text-center hidden md:table-cell">{equipo.goles_en_contra ?? 0}</td>
                    <td className="px-3 py-3 text-center hidden md:table-cell">{equipo.diferencia_de_goles ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500 italic">No hay datos de clasificación disponibles.</p>
      )}
    </div>
  );
}

export default TablaPosicionesPage;
