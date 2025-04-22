// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Importa las funciones API de publicroutes.js
import {
  getCarruselPublic,
  getEquiposRequest,
  getJugadoresRequest,
  getNoticiasPublic_3, // O getNoticiasPublic si prefieres paginar
  getCalendarioRequest,
} from '../api/publicroutes'; // Asegúrate que la ruta sea correcta

// Importa los nuevos componentes de widgets
import CarruselNoticias from '../components/public/CarruselNoticias';
import EnElFocoWidget from '../components/public/EnElFocoWidget';
import MiniTablaPosiciones from '../components/public/MiniTablaPosiciones';
import TopGoleadores from '../components/public/TopGoleadores';
import FeedNoticias from '../components/public/FeedNoticias';

// Importa CSS de react-slick (¡IMPORTANTE!)
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function HomePage() {
  const [carruselNoticias, setCarruselNoticias] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [jugadores, setJugadores] = useState([]);
  const [otrasNoticias, setOtrasNoticias] = useState([]);
  const [partidos, setPartidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDatosInicio = async () => {
      setLoading(true);
      setError(null);
      try {
        const [
          resCarrusel,
          resEquipos,
          resJugadores,
          resOtrasNoticias,
          resPartidos,
        ] = await Promise.all([
          getCarruselPublic(),
          getEquiposRequest(),
          getJugadoresRequest(),
          getNoticiasPublic_3(), // Carga las noticias después del carrusel
          getCalendarioRequest(),
        ]);

        setCarruselNoticias(resCarrusel.data || []);
        setEquipos(resEquipos.data || []);
        setJugadores(resJugadores.data || []);
        setOtrasNoticias(resOtrasNoticias.data || []);
        setPartidos(resPartidos.data || []);

      } catch (err) {
        console.error("Error cargando datos para HomePage:", err);
        setError("No se pudieron cargar todos los datos. Intenta de nuevo más tarde.");
        // Podrías setear los estados a arrays vacíos para que no rompa la UI
        setCarruselNoticias([]);
        setEquipos([]);
        setJugadores([]);
        setOtrasNoticias([]);
        setPartidos([]);
      } finally {
        setLoading(false);
      }
    };

    cargarDatosInicio();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl font-semibold text-gray-600 animate-pulse">Cargando Liga...</p>
        {/* Podrías poner un spinner SVG aquí */}
      </div>
    );
  }

  // No mostraremos un error gigante, pero podrías tener un banner si 'error' tiene valor

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* --- Hero Section --- */}
      <section className="mb-8">
        {carruselNoticias.length > 0 ? (
          <CarruselNoticias noticias={carruselNoticias} />
        ) : (
          <div className="h-64 bg-gray-300 flex items-center justify-center text-gray-500">
            {/* Placeholder si no hay noticias para el carrusel */}
            <p>No hay noticias destacadas por ahora.</p>
          </div>
        )}
      </section>

      {/* --- Contenido Principal (Grid) --- */}
      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Columna Izquierda (Widgets Principales) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Widget En el Foco */}
            <EnElFocoWidget partidos={partidos} />

            {/* Feed de Otras Noticias */}
            <FeedNoticias noticias={otrasNoticias} />
          </div>

          {/* Columna Derecha (Widgets Secundarios) */}
          <div className="lg:col-span-1 space-y-8">
            {/* Mini Tabla de Posiciones */}
            <MiniTablaPosiciones equipos={equipos} />

            {/* Top Goleadores */}
            <TopGoleadores jugadores={jugadores} />

            {/* Podrías añadir aquí accesos rápidos o publicidad */}
             <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-lg font-semibold mb-3 text-gray-700">Explora</h3>
                <div className="space-y-2">
                    <Link to="/tabla" className="block text-blue-600 hover:text-blue-800 font-medium">» Tabla Completa</Link>
                    <Link to="/calendario" className="block text-blue-600 hover:text-blue-800 font-medium">» Calendario y Resultados</Link>
                    <Link to="/equipos" className="block text-blue-600 hover:text-blue-800 font-medium">» Equipos</Link>
                    <Link to="/estadisticas" className="block text-blue-600 hover:text-blue-800 font-medium">» Estadísticas</Link>
                    <Link to="/noticias" className="block text-blue-600 hover:text-blue-800 font-medium">» Todas las Noticias</Link>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default HomePage;
