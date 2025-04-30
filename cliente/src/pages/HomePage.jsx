// cliente/src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// --- Importa el hook del contexto ---
import { usePublic } from '../context/PublicContex'; // <-- Usamos el hook

// --- Mantenemos la importación directa SOLO para lo que NO está en el contexto ---
import { getAlertStatus } from '../api/publicroutes'; // <-- Solo para la alerta
import EspacioPublicidad from '../components/public/EspacioPublicidad';
// Importa los componentes de widgets y el AlertBanner (sin cambios)
import CarruselNoticias from '../components/public/CarruselNoticias';
import EnElFocoWidget from '../components/public/EnElFocoWidget';
import MiniTablaPosiciones from '../components/public/MiniTablaPosiciones';
import TopGoleadores from '../components/public/TopGoleadores';
import FeedNoticias from '../components/public/FeedNoticias';
import AlertBanner from '../components/public/AlertBanner';

// Importa CSS de react-slick (sin cambios)
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
 
function HomePage() {
  // --- Obtenemos funciones y estado del contexto ---
  const {
    getCarrusel, carrusel,
    getEquipos, equipos,
    getJuga, jugadores, // <-- Ojo: la función se llama getJuga en el contexto
    getNotis_3, publico, // <-- Ojo: el estado de noticias se llama publico
    getFechas, fechas, // <-- Asumimos que 'fechas' reemplaza a 'partidos'
  } = usePublic();

  // --- Estados locales solo para carga, error y alerta (que no está en contexto) ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alertInfo, setAlertInfo] = useState({ isActive: false, message: '', type: 'info' });

  useEffect(() => {
    const cargarDatosInicio = async () => {
      setLoading(true);
      setError(null);
      try {
        // --- Llamamos a las funciones del contexto y la directa de alerta ---
        // Promise.all sigue siendo útil para ejecutar en paralelo
        const [, , , , , resAlert] = await Promise.all([ // Usamos '_' para las respuestas que no necesitamos procesar aquí (los datos ya están en el estado del contexto)
          getCarrusel(),
          getEquipos(),
          getJuga(),
          getNotis_3(),
          getFechas(),
          getAlertStatus(), // <-- Llamada directa mantenida
        ]);

        // --- Guardar solo la información de la alerta (el resto se actualiza en el contexto) ---
        setAlertInfo(resAlert.data || { isActive: false, message: '', type: 'info' });

      } catch (err) {
        console.error("Error cargando datos para HomePage (vía contexto y directa):", err);
        setError("No se pudieron cargar todos los datos. Intenta de nuevo más tarde.");
        // No necesitamos resetear estados del contexto aquí, pero sí el de alerta local
        setAlertInfo({ isActive: false, message: '', type: 'info' });
      } finally {
        setLoading(false);
      }
    };

    cargarDatosInicio();
    // --- Actualizamos las dependencias del useEffect ---
  }, [getCarrusel, getEquipos, getJuga, getNotis_3, getFechas]); // <-- Dependencias actualizadas

  // --- Renderizado ---

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl font-semibold text-gray-600 animate-pulse">Cargando Liga...</p>
      </div>
    );
  }

  // Opcional: Mostrar error general
  // if (error) { ... }
  
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* --- Hero Section (Usa 'carrusel' del contexto) --- */}
      <section className="mb-8">
        {carrusel && carrusel.length > 0 ? (
          <CarruselNoticias noticias={carrusel} />
        ) : (
          <div className="h-64 bg-gray-300 flex items-center justify-center text-gray-500">
            <p>No hay noticias destacadas por ahora.</p>
          </div>
        )}
      </section>

      {/* --- Renderizado Condicional del Banner de Alerta (sin cambios) --- */}
      {alertInfo.isActive && (
        <div className="container mx-auto px-4 mb-8">
          <AlertBanner message={alertInfo.message} type={alertInfo.type} />
        </div>
      )}

      {/* --- Contenido Principal (Grid) --- */}
      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Columna Izquierda */}
          <div className="lg:col-span-2 space-y-8">
            {/* Widget "En el Foco" (Usa 'fechas' del contexto, asumiendo que es lo que necesita) */}
            {/* Si EnElFocoWidget espera una prop llamada 'partidos', pásala así: partidos={fechas} */}
            <EnElFocoWidget partidos={fechas} />
            {/* Feed de Noticias (Usa 'publico' del contexto) */}
            <FeedNoticias noticias={publico} />
          </div>

          {/* Columna Derecha */}
          <div className="lg:col-span-1 space-y-8">
            {/* Mini Tabla (Usa 'equipos' del contexto) */}
            <MiniTablaPosiciones equipos={equipos} />
            {/* Top Goleadores (Usa 'jugadores' del contexto) */}
            <TopGoleadores jugadores={jugadores} />
            {/* Sección "Explora" (sin cambios) */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold mb-3 text-gray-700">Explora</h3>
              <div className="space-y-2">
                <Link to="/web/tabla" className="block text-blue-600 hover:text-blue-800 font-medium">» Tabla Completa</Link>
                <Link to="/web/calendario" className="block text-blue-600 hover:text-blue-800 font-medium">» Calendario y Resultados</Link>
                <Link to="/web/equipos" className="block text-blue-600 hover:text-blue-800 font-medium">» Equipos</Link>
                <Link to="/web/estadisticas" className="block text-blue-600 hover:text-blue-800 font-medium">» Estadísticas</Link>
                <Link to="/web/noticias" className="block text-blue-600 hover:text-blue-800 font-medium">» Todas las Noticias</Link>
              </div>
            </div>
          </div>

        </div>
      </div>
      {/* --- Sección de Publicidad Inferior --- */}
    {/* Contenedor con padding */}
    <div className="container mx-auto px-4 pb-12">
      {/* Aplicamos grid de 12 columnas en 'lg', con espacio */}
      {/* Usamos 'items-start' para alinear los elementos al inicio de su celda si tienen diferente altura */}
      <div className='lg:grid lg:grid-cols-12 lg:gap-4 items-start'> {/* Cambiado a 12 columnas en lg */}

        {/* Anuncio 1: Ocupa 2 de 12 columnas en 'lg' */}
        <div className="lg:col-span-2 mb-4 lg:mb-0"> {/* Añadido div contenedor y col-span */}
          <EspacioPublicidad
            imagenSrc="/imagenes/imagen_01.jpg" // ¡Verifica ruta!
            altPublicidad="Anuncio de Ejemplo 1"
          />
        </div>
        {/* Espacio vacío 1: Ocupa 1 de 12 columnas en 'lg', oculto en móvil */}
        <div className="hidden lg:block lg:col-span-1"></div> {/* <--- ESPACIO VACÍO */}

        {/* Anuncio 2: Ocupa 2 de 12 columnas en 'lg' */}
        <div className="lg:col-span-2 mb-4 lg:mb-0"> {/* Añadido div contenedor y col-span */}
          <EspacioPublicidad
            imagenSrc="/imagenes/imagen_02.jpg" // ¡Verifica ruta!
            altPublicidad="Anuncio de Ejemplo 2"
          />
        </div>
        {/* Espacio vacío 2: Ocupa 1 de 12 columnas en 'lg', oculto en móvil */}
        <div className="hidden lg:block lg:col-span-1"></div> {/* <--- ESPACIO VACÍO */}

        {/* Anuncio 3: Ocupa 2 de 12 columnas en 'lg' */}
        <div className="lg:col-span-2 mb-4 lg:mb-0"> {/* Añadido div contenedor y col-span */}
          <EspacioPublicidad
            imagenSrc="/imagenes/imagen_03.jpg" // ¡Verifica ruta!
            altPublicidad="Anuncio de Ejemplo 3"
          />
        </div>
        {/* Espacio vacío 3: Ocupa 1 de 12 columnas en 'lg', oculto en móvil */}
        <div className="hidden lg:block lg:col-span-1"></div> {/* <--- ESPACIO VACÍO */}

        {/* Anuncio 4: Ocupa 2 de 12 columnas en 'lg' */}
        <div className="lg:col-span-2 mb-4 lg:mb-0"> {/* Añadido div contenedor y col-span */}
          <EspacioPublicidad
            imagenSrc="/imagenes/imagen_04.jpg" // ¡Verifica ruta!
            altPublicidad="Anuncio de Ejemplo 4"
          />
        </div>
        {/* Espacio vacío 4: Ocupa 1 de 12 columnas en 'lg', oculto en móvil */}
        <div className="hidden lg:block lg:col-span-1"></div> {/* <--- ESPACIO VACÍO */}

      </div> {/* Cierre del grid lg:grid-cols-12 */}
    </div>
    </div>
  );
}

export default HomePage;
