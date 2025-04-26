// src/pages/EquiposWebPage.jsx
import React, { useState, useEffect } from 'react';
// --- Importa el hook del contexto ---
import { usePublic } from '../context/PublicContex'; // <-- Asegúrate que la ruta sea correcta
import EquipoCard from '../components/public/EquipoCard';
import LoadingSpinner from '../components/LoadingSpinner';
import useScreenSize from '../hooks/useScreenSize';
import EquipoDeckMobile from '../components/public/EquipoDeckMobile';

function EquiposWebPage() {
  // --- Obtenemos la función y el estado del contexto ---
  const { getEquipos, equipos: equiposFromContext } = usePublic(); // <-- Usamos el hook

  // --- Mantenemos estados locales para carga y error específicos de esta página ---
  // Aunque el contexto puede tener su propio estado, esta página necesita saber
  // cuándo *su propia* solicitud inicial de datos está en curso o ha fallado.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isMobile } = useScreenSize(); // Sin cambios

  useEffect(() => {
    const fetchEquipos = async () => {
      // Solo intentamos cargar si no hay equipos ya en el contexto
      // Opcional: podrías decidir recargar siempre o solo si está vacío.
      // Por ahora, cargaremos siempre al montar esta página para asegurar datos frescos.
      setLoading(true);
      setError(null);
      try {
        // --- Llamamos a la función del contexto ---
        await getEquipos(); // <-- Llama a la función del contexto para cargar/actualizar los equipos
        // No necesitamos 'res.data' aquí porque el contexto actualiza su propio estado 'equipos'.
      } catch (err) {
        // El contexto ya podría hacer console.log, pero establecemos el error local
        console.error("Error en EquiposWebPage al llamar a getEquipos del contexto:", err);
        setError("No se pudieron cargar los equipos. Intenta de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchEquipos();

    // --- Añadimos getEquipos a las dependencias ---
  }, []); // <-- Dependencia del efecto

  // --- Renderizado Condicional (usando equiposFromContext) ---
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

  // --- Usamos equiposFromContext para renderizar ---
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-violet-800 mb-8 md:mb-12">
        Nuestros Equipos
      </h1>

      {/* Verificamos si equiposFromContext existe y tiene elementos */}
      {equiposFromContext && equiposFromContext.length > 0 ? (
        isMobile ? (
          <EquipoDeckMobile equipos={equiposFromContext} /> // Pasamos los equipos del contexto
        ) : (
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
              {/* Mapeamos sobre los equipos del contexto */}
              {equiposFromContext.map((equipo) => (
                <EquipoCard key={equipo._id} equipo={equipo} />
              ))}
            </div>
          </div>
        )
      ) : (
        // Mostramos mensaje si no hay equipos (incluso después de intentar cargar)
        !loading && !error && <p className="text-center text-gray-500 italic px-4">No hay equipos registrados por el momento.</p>
      )}
    </div>
  );
}

export default EquiposWebPage;
