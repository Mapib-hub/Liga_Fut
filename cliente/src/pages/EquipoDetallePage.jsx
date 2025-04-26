// src/pages/EquipoDetallePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usePublic } from '../context/PublicContex'; // Asegúrate que la ruta sea correcta
import { BACKEND_ORIGIN } from '../config';
import { FiShieldOff, FiLoader, FiAlertCircle, FiMapPin, FiCalendar } from 'react-icons/fi';
import FormatDate from '../components/FormatDate';
import EquipoStats from '../components/public/EquipoStats';
import JugadorCard from '../components/public/JugadorCard'; // <-- AÑADE ESTA LÍNEA

// --- Componente RenderEscudoDetalle (MODIFICADO) ---
const RenderEscudoDetalle = ({ equipo }) => {
    if (!equipo?.foto_equipo) {
        // Placeholder: Sin círculo, 80% ancho, esquinas redondeadas, aspecto cuadrado
        return (
            <div className="w-4/5 aspect-square flex items-center justify-center bg-gray-200 text-gray-500 rounded-lg mx-auto lg:mx-0 mb-4 select-none">
                <FiShieldOff size={60} /> {/* Tamaño del icono puede ajustarse si es necesario */}
            </div>
        );
    }
    const imageUrl = `${BACKEND_ORIGIN}/uploads/equipos/${equipo.foto_equipo.replace(/\\/g, '/')}`;
    return (
        <img
            src={imageUrl}
            alt={`Escudo de ${equipo.nombre}`}
            // Estilo: Sin círculo, 80% ancho, esquinas redondeadas, object-contain
            className="w-4/5 object-contain rounded-lg mx-auto lg:mx-0 mb-4 shadow-md select-none"
            onError={(e) => {
                e.target.onerror = null; // Previene bucles si el fallback también falla
                e.target.style.display = 'none'; // Oculta la imagen rota
                const parent = e.target.parentElement;
                if (parent) {
                    // Asegúrate que el fallback tenga el mismo estilo que el placeholder principal
                    const fallback = document.createElement('div');
                    fallback.className = "w-4/5 aspect-square flex items-center justify-center bg-gray-200 text-gray-500 rounded-lg mx-auto lg:mx-0 mb-4 select-none"; // <-- Clases actualizadas aquí también
                    // Inserta el icono SVG directamente (más fiable que innerHTML a veces)
                    const svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                    svgIcon.setAttribute("stroke", "currentColor");
                    svgIcon.setAttribute("fill", "currentColor");
                    svgIcon.setAttribute("stroke-width", "0");
                    svgIcon.setAttribute("viewBox", "0 0 24 24");
                    svgIcon.setAttribute("height", "60"); // Ajusta tamaño icono si es necesario
                    svgIcon.setAttribute("width", "60"); // Ajusta tamaño icono si es necesario
                    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                    path.setAttribute("fill", "none");
                    path.setAttribute("stroke", "#000");
                    path.setAttribute("stroke-width", "2");
                    path.setAttribute("d", "M12,3 L3,7 L3,13 C3,18.5 7,21 12,21 C17,21 21,18.5 21,13 L21,7 L12,3 Z M19,13 C19,16.1 16.5,18.4 13.5,18.9 L13.5,13 L16,13 L16,10 L13.5,10 L13.5,8 L10.5,8 L10.5,10 L8,10 L8,13 L10.5,13 L10.5,18.9 C7.5,18.4 5,16.1 5,13 L5,8.4 L12,5.4 L19,8.4 L19,13 Z");
                    svgIcon.appendChild(path);
                    fallback.appendChild(svgIcon);

                    parent.insertBefore(fallback, e.target); // Inserta el fallback antes de la imagen rota
                }
            }}
        />
    );
};

// --- Componente Principal de la Página de Detalle ---
function EquipoDetallePage() {
    const { id } = useParams();
    const { getEquipo } = usePublic();
    const [equipo, setEquipo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // ... (useEffect sin cambios) ...
        const fetchEquipoData = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getEquipo(id);
                if (data) {
                    setEquipo(data);
                } else {
                    throw new Error('No se encontraron datos para este equipo o la solicitud falló.');
                }
            } catch (err) {
                console.error("Error en EquipoDetallePage al obtener datos vía contexto:", err);
                setError(err.message || 'Hubo un problema al cargar la información del equipo.');
                setEquipo(null);
            } finally {
                setLoading(false);
            }
        };
        fetchEquipoData();
    }, [id, getEquipo]);

    // --- Renderizado Condicional ---
    if (loading) { /* ... (sin cambios) ... */ }
    if (error) { /* ... (sin cambios) ... */ }
    if (!equipo) { /* ... (sin cambios) ... */ }
    //console.log(equipo);
    // --- Renderizado del Contenido del Equipo ---
    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="bg-white shadow-xl rounded-lg p-6 md:p-8">

                {/* --- Nombre (Ancho Completo Superior) --- */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-violet-800 mb-8 text-center break-words">
                    {equipo?.nombre}
                </h1>

                {/* --- Contenedor para las 2 Columnas --- */}
                <div className="flex flex-col lg:flex-row lg:gap-10 mb-8">

                    {/* Columna Izquierda (Imagen y Datos Básicos) */}
                    <div className="lg:w-1/3 flex flex-col items-center lg:items-start mb-6 lg:mb-0">
                        {/* ////// RenderEscudoDetalle ahora usa los nuevos estilos ////// */}
                        <RenderEscudoDetalle equipo={equipo} />
                        {/* Datos básicos debajo del escudo */}
                        <div className="text-sm text-gray-600 space-y-2 text-center lg:text-left mt-4">
                            {equipo?.estadio && (
                                <p className="flex items-center justify-center lg:justify-start">
                                    <FiMapPin className="mr-2 text-gray-500" />
                                    <strong>Estadio:</strong>&nbsp;{equipo.estadio}
                                </p>
                            )}
                            {equipo?.fundado && (
                                <p className="flex items-center justify-center lg:justify-start">
                                    <FiCalendar className="mr-2 text-gray-500" />
                                    <strong>Fundado en:</strong>&nbsp;
                                    {/* ////// USA EL COMPONENTE FORMATDATE AQUÍ ////// */}
                                    <FormatDate date={equipo.fundado} options={{ year: 'numeric' }} />
                                    {/* Si 'fundado' es solo el año, options no es estrictamente necesario */}
                                    {/* Si es una fecha completa, puedes ajustar 'options' o quitarlo para el formato por defecto */}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Columna Derecha (Descripción) */}
                    <div className="lg:w-2/3">
                        {equipo?.description ? (
                            <p className="text-gray-700 text-base md:text-lg text-justify lg:text-justify whitespace-pre-wrap leading-relaxed">
                                {equipo.description}
                            </p>
                        ) : (
                            <p className="text-gray-500 italic text-center lg:text-left pt-4">
                                No hay descripción disponible para este equipo.
                            </p>
                        )}
                    </div>
                </div>

                {/* --- Separador --- */}
                <hr className="my-8" />

                {/* --- Sección de Estadísticas (Ancho Completo) --- */}
                <div className="mt-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2 text-left">Estadísticas</h2>
                    {(() => {
                        if (!equipo) return null;

                        // ----- OBJETO MODIFICADO PARA INCLUIR GOLES -----
                        const statsParaPasar = {
                            jugados: equipo.partidos_jugados ?? 0,
                            pg: equipo.victorias ?? 0,
                            pe: equipo.empates ?? 0,
                            pp: equipo.derrotas ?? 0,
                            gf: equipo.goles_a_favor ?? 0,
                            gc: equipo.goles_en_contra ?? 0,
                            dg: equipo.diferencia_de_goles ?? 0, // Puede ser negativo
                        };

                        return <EquipoStats estadisticas={statsParaPasar} />;
                    })()}
                </div>

                {/* --- Sección de Jugadores (Ancho Completo) --- */}
                <div className="text-left mt-10">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Plantel</h2>
                    {equipo?.jugadores && equipo.jugadores.length > 0 ? (
                        // ----- DIV CONVERTIDO A GRID RESPONSIVO -----
                        // grid-cols-1 por defecto (móvil, lista vertical)
                        // lg:grid-cols-3 para 3 columnas en pantallas grandes
                        // gap-4 para el espacio entre tarjetas
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {equipo.jugadores.map((jugador) => (
                                <JugadorCard key={jugador._id} jugador={jugador} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 italic text-center py-4">
                            No hay jugadores registrados para este equipo por el momento.
                        </p>
                    )}
                </div>

            </div>
        </div>
    );
}

export default EquipoDetallePage;
