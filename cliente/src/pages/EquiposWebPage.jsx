// src/pages/EquiposWebPage.jsx
import React, { useState, useEffect } from 'react';
// --- Importa el hook del contexto ---
import { usePublic } from '../context/PublicContex'; // <-- Asegúrate que la ruta sea correcta
import EquipoCard from '../components/public/EquipoCard';
import LoadingSpinner from '../components/LoadingSpinner';
import useScreenSize from '../hooks/useScreenSize';
import EquipoDeckMobile from '../components/public/EquipoDeckMobile';
import EspacioPublicidad from '../components/public/EspacioPublicidad'; // <-- Importamos el componente de publicidad

function EquiposWebPage() {
  // --- Obtenemos la función y el estado del contexto ---
  const { getEquipos, equipos: equiposFromContext } = usePublic(); // <-- Usamos el hook

  // --- Mantenemos estados locales para carga y error específicos de esta página ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isMobile } = useScreenSize(); // Sin cambios

  useEffect(() => {
    const fetchEquipos = async () => {
      setLoading(true);
      setError(null);
      try {
        // --- Llamamos a la función del contexto ---
        await getEquipos(); // <-- Llama a la función del contexto para cargar/actualizar los equipos
      } catch (err) {
        console.error("Error en EquiposWebPage al llamar a getEquipos del contexto:", err);
        setError("No se pudieron cargar los equipos. Intenta de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchEquipos();
  }, []); // <-- Dependencia del efecto (getEquipos podría incluirse si cambia, pero usualmente es estable)

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

  // --- Renderizado Principal ---
  return (
    // Contenedor principal
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-violet-800 mb-8 md:mb-12">
        Nuestros Equipos
      </h1>

      {/* Contenido Principal: Lista de Equipos */}
      <div className="mb-12"> {/* Añadimos margen inferior para separar de la publicidad */}
        {equiposFromContext && equiposFromContext.length > 0 ? (
          isMobile ? (
            <EquipoDeckMobile equipos={equiposFromContext} /> // Pasamos los equipos del contexto
          ) : (
            // Quitamos container y px-4 redundantes si el padre ya los tiene
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
              {/* Mapeamos sobre los equipos del contexto */}
              {equiposFromContext.map((equipo) => (
                <EquipoCard key={equipo._id} equipo={equipo} />
              ))}
            </div>
          )
        ) : (
          // Mostramos mensaje si no hay equipos
          !loading && !error && <p className="text-center text-gray-500 italic">No hay equipos registrados por el momento.</p>
        )}
      </div> {/* Fin del Contenido Principal (Equipos) */}

      {/* --- Sección de Publicidad Inferior --- */}
      <div className="container mx-auto px-4 pb-12">
        {/* --- MODIFICADO AQUÍ --- */}
        {/* Aplicamos grid y 2 columnas POR DEFECTO (móvil) */}
        {/* Luego, en 'lg', cambiamos a 12 columnas */}
        {/* Añadimos un gap para móvil y mantenemos el de lg */}
        <div className='grid grid-cols-2 gap-4 lg:grid-cols-12 lg:gap-4 items-start'>

          {/* Anuncio 1: Ocupa 1 celda en móvil (automático), 2 en lg */}
          {/* --- MODIFICADO: Removido mb-4, ya que gap-4 lo maneja --- */}
          <div className="lg:col-span-2 lg:mb-0">
            <EspacioPublicidad
              imagenSrc="/imagenes/imagen_01.jpg" // ¡Verifica ruta!
              altPublicidad="Anuncio de Ejemplo 1"
            />
          </div>
          {/* Espacio vacío 1: Sigue oculto en móvil */}
          <div className="hidden lg:block lg:col-span-1"></div> {/* <--- ESPACIO VACÍO */}

          {/* Anuncio 2: Ocupa 1 celda en móvil (automático), 2 en lg */}
          {/* --- MODIFICADO: Removido mb-4 --- */}
          <div className="lg:col-span-2 lg:mb-0">
            <EspacioPublicidad
              imagenSrc="/imagenes/imagen_02.jpg" // ¡Verifica ruta!
              altPublicidad="Anuncio de Ejemplo 2"
            />
          </div>
          {/* Espacio vacío 2: Sigue oculto en móvil */}
          <div className="hidden lg:block lg:col-span-1"></div> {/* <--- ESPACIO VACÍO */}

          {/* Anuncio 3: Ocupa 1 celda en móvil (automático), 2 en lg */}
          {/* --- MODIFICADO: Removido mb-4 --- */}
          <div className="lg:col-span-2 lg:mb-0">
            <EspacioPublicidad
              imagenSrc="/imagenes/imagen_03.jpg" // ¡Verifica ruta!
              altPublicidad="Anuncio de Ejemplo 3"
            />
          </div>
          {/* Espacio vacío 3: Sigue oculto en móvil */}
          <div className="hidden lg:block lg:col-span-1"></div> {/* <--- ESPACIO VACÍO */}

          {/* Anuncio 4: Ocupa 1 celda en móvil (automático), 2 en lg */}
          {/* --- MODIFICADO: Removido mb-4 --- */}
          <div className="lg:col-span-2 lg:mb-0">
            <EspacioPublicidad
              imagenSrc="/imagenes/imagen_04.jpg" // ¡Verifica ruta!
              altPublicidad="Anuncio de Ejemplo 4"
            />
          </div>
          {/* Espacio vacío 4: Sigue oculto en móvil */}
          {/* Considera si necesitas este último espacio en lg */}
          <div className="hidden lg:block lg:col-span-1"></div> {/* <--- ESPACIO VACÍO */}

        </div> {/* Cierre del grid */}
      </div> {/* Cierre del container de publicidad */}

    </div> // Fin del contenedor principal
  );
}

export default EquiposWebPage;
