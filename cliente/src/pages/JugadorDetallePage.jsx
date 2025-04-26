// src/pages/JugadorDetallePage.jsx
import React, { useState, useEffect } from 'react'; // <-- Añade useState y useEffect
import { useParams, useNavigate } from "react-router-dom"; // <-- Añade useNavigate (opcional, para errores)
import { usePublic } from '../context/PublicContex';
import LoadingSpinner from '../components/LoadingSpinner'; // <-- Añade Spinner
import { BACKEND_ORIGIN } from '../config'; // <-- Añade para la imagen
import { FiUserX } from 'react-icons/fi';
import FormatDate from '../components/FormatDate';

// Componente para renderizar la foto (similar a EquipoDetallePage)
const RenderFotoDetalle = ({ jugador }) => {
    if (!jugador?.foto_jug) {
        return (
            <div className="w-full max-w-xs aspect-square flex items-center justify-center bg-gray-200 text-gray-500 rounded-lg mx-auto mb-4 select-none">
                <FiUserX size={60} />
            </div>
        );
    }
    const imageUrl = `${BACKEND_ORIGIN}/uploads/jugadores/${jugador.foto_jug.replace(/\\/g, '/')}`;
    return (
        <img
            src={imageUrl}
            alt={`Foto de ${jugador.nombre} ${jugador.apellido}`}
            className="w-full max-w-xs object-contain rounded-lg mx-auto mb-4 shadow-md select-none"
            onError={(e) => { /* ... (Manejo de error similar a RenderEscudoDetalle si quieres) ... */
                e.target.style.display = 'none'; // Oculta si falla
            }}
        />
    );
};


const JugadorDetallePage = () => {
    // --- CORRECCIÓN: Usa el nombre correcto 'getJug' ---
    const { getJug } = usePublic();
    const { id } = useParams();
    const navigate = useNavigate(); // Opcional

    // --- Añade Estado Local ---
    const [jugador, setJugador] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- useEffect para Cargar Datos ---
    useEffect(() => {
        const fetchJugadorData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Llama a la función async y espera la respuesta
                const data = await getJug(id);
                if (data) {
                    setJugador(data); // Guarda los datos en el estado local
                } else {
                    // Si getJug devuelve null o undefined por error o no encontrado
                    throw new Error('No se encontraron datos para este jugador.');
                }
            } catch (err) {
                console.error("Error en JugadorDetallePage:", err);
                setError(err.message || 'Hubo un problema al cargar la información.');
                setJugador(null);
                // Opcional: Redirigir a página de error o mostrar mensaje
                // navigate('/error');
            } finally {
                setLoading(false);
            }
        };

        fetchJugadorData();
    }, [id, getJug, navigate]); // <-- Dependencias del efecto

    // --- Renderizado Condicional ---
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

    if (!jugador) {
        // Esto no debería pasar si el manejo de error es correcto, pero por si acaso
        return (
            <div className="container mx-auto px-4 py-8 text-center text-gray-500">
                <p>No se encontró información del jugador.</p>
            </div>
        );
    }

    // --- Renderizado del Contenido del Jugador ---
    return (
        <div className="container mx-auto px-4 py-8">
            {/* --- Tarjeta Gigante --- */}
            <div className="w-full max-w-4xl mx-auto mt-12 bg-white rounded-lg shadow-xl p-6 md:p-8">

                {/* Nombre del Jugador */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center break-words">
                    {jugador.nombre} {jugador.apellido}
                </h1>

                {/* Contenedor 2 Columnas */}
                <div className="flex flex-col md:flex-row md:gap-8">

                    {/* Columna Izquierda (Foto) */}
                    <div className="md:w-1/3 mb-6 md:mb-0 flex justify-center">
                       <RenderFotoDetalle jugador={jugador} />
                    </div>

                    {/* Columna Derecha (Datos) */}
                    <div className="md:w-2/3 space-y-3 text-gray-700">
                        <p><strong>Equipo:</strong> {jugador.equip?.nombre || 'Sin equipo asignado'}</p>
                        <p><strong>Posición:</strong> {jugador.posicion || 'No especificada'}</p>
                        {/* Añade más campos según tu modelo de datos */}
                        {jugador.fecha_nac && (
                            <p><strong>Fecha de Nacimiento:</strong> <FormatDate date={jugador.fecha_nac} /></p>
                            // Necesitarías importar FormatDate si lo usas
                        )}
                        <p><strong>Goles:</strong> {jugador.goles ?? 0}</p>
                        <p><strong>Tarjetas Amarillas:</strong> {jugador.tarjetas_amarillas ?? 0}</p>
                        <p><strong>Tarjetas Rojas:</strong> {jugador.tarjetas_rojas ?? 0}</p>
                        {/* Puedes añadir más detalles aquí */}
                    </div>
                </div>

                 {/* Puedes añadir más secciones si es necesario, como historial, etc. */}

            </div>
            {/* --- Fin Tarjeta Gigante --- */}
        </div>
    );
};

export default JugadorDetallePage; // <-- Asegúrate que esta línea esté presente
