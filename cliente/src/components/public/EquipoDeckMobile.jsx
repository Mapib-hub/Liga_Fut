// src/components/public/EquipoDeckMobile.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BACKEND_ORIGIN } from '../../config';
import { FiShieldOff, FiExternalLink } from 'react-icons/fi';

// --- DeckCard (Con diseño impactante y drag arreglado) ---
const DeckCard = ({ equipo, isActive }) => {

  // --- RenderEscudo (Ajustado para alinear abajo y deshabilitar drag nativo) ---
  const RenderEscudo = ({ equipo }) => {
    // Fallback si no hay foto_equipo
    if (!equipo?.foto_equipo) {
      return (
        // El div de fallback también debe llenar el espacio y no ser arrastrable/seleccionable
        <div
          className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 select-none" // h-full para llenar el contenedor, select-none
          aria-label="Sin escudo"
          draggable="false" // Evita drag nativo del placeholder
        >
          <FiShieldOff size={80} />
        </div>
      );
    }
    // Construcción de la URL (sin cambios)
    const imageUrl = `${BACKEND_ORIGIN}/uploads/equipos/${equipo.foto_equipo.replace(/\\/g, '/')}`;

    return (
      <img
        src={imageUrl}
        alt={`Escudo de ${equipo.nombre}`}
        // --- ATRIBUTO CLAVE AÑADIDO ---
        draggable="false" // <-- ¡ESTE ES EL CAMBIO PRINCIPAL! Le dice al navegador que no permita el arrastre nativo de esta imagen.
        // --- CLASES CORREGIDAS Y MEJORADAS ---
        // h-full: Para que la imagen intente ocupar toda la altura de su contenedor (el div de h-[90%]).
        // object-contain: Mantiene la proporción de la imagen.
        // object-bottom: Alinea la imagen abajo dentro de su espacio si 'object-contain' deja espacio vertical.
        // select-none: Evita que la imagen o texto cercano se seleccione al intentar arrastrar (mejora UX).
        className="w-full h-full object-contain object-bottom bg-white select-none" // Asegurado h-full, añadido select-none
        onError={(e) => {
          // Manejo de error si la imagen no carga
          e.target.onerror = null; // Previene loops de error
          e.target.style.display = 'none'; // Oculta la etiqueta <img> rota

          const parent = e.target.parentElement;
          if (parent) {
            // Crear y añadir el div de fallback dinámicamente
            const fallback = document.createElement('div');
            // El fallback dinámico también debe ser h-full, select-none y draggable="false"
            fallback.className = "w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 select-none";
            fallback.setAttribute('aria-label', 'Sin escudo');
            fallback.setAttribute('draggable', 'false'); // Importante para el fallback dinámico
            fallback.innerHTML = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="80" width="80" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="#000" stroke-width="2" d="M12,3 L3,7 L3,13 C3,18.5 7,21 12,21 C17,21 21,18.5 21,13 L21,7 L12,3 Z M19,13 C19,16.1 16.5,18.4 13.5,18.9 L13.5,13 L16,13 L16,10 L13.5,10 L13.5,8 L10.5,8 L10.5,10 L8,10 L8,13 L10.5,13 L10.5,18.9 C7.5,18.4 5,16.1 5,13 L5,8.4 L12,5.4 L19,8.4 L19,13 Z"></path></svg>`;
            // Insertar el fallback justo antes de la imagen rota (que está oculta)
            parent.insertBefore(fallback, e.target);
          }
        }}
      />
    );
  };

  // --- Estilo Base de la Tarjeta (sin cambios) ---
  const cardBaseStyle = "absolute inset-0 bg-white rounded-xl shadow-lg overflow-hidden flex flex-col justify-between";

  return (
    // Este div es el contenedor principal de la tarjeta
    <div className={cardBaseStyle}>

      {/* --- Contenedor Superior: Imagen y Nombre Superpuesto --- */}
      {/* Este div usa flex items-end para alinear RenderEscudo abajo */}
      <div className="relative w-full h-[90%] flex items-end">
        {/* RenderEscudo ahora contiene la imagen alineada abajo y no interfiere con el drag */}
        <RenderEscudo equipo={equipo} />

        {/* Nombre Superpuesto (sin cambios) */}
        <div className="absolute top-0 left-0 right-0 p-4 pt-5 z-10
                       bg-gradient-to-b from-black/60 via-black/40 to-transparent pointer-events-none"> {/* Añadido pointer-events-none al gradiente/nombre */}
          <h3 className="font-bold text-xl text-white text-center leading-tight break-words text-shadow-md"
              title={equipo.nombre}>
            {equipo.nombre}
          </h3>
        </div>
      </div>

      {/* --- Contenido Inferior: Indicador y Botón (sin cambios) --- */}
      <div className="w-full flex flex-col items-center justify-center p-4 text-center flex-grow">
        {isActive && (
          <div className="text-xs text-gray-400 animate-pulse mb-3">
            Desliza hacia arriba
          </div>
        )}
        <Link
          to={`/equipos/${equipo._id}`}
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
          aria-label={`Ver detalles de ${equipo.nombre}`}
          onClick={(e) => e.stopPropagation()} // Evita que el drag se active al hacer clic en el botón
        >
          Ver Detalles
          <FiExternalLink className="ml-2 -mr-1 h-4 w-4" />
        </Link>
      </div>

    </div>
  );
};


// --- Componente Principal del Mazo (EquipoDeckMobile) ---
function EquipoDeckMobile({ equipos }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // --- Lógica de Swipe (sin cambios) ---
  const SWIPE_THRESHOLD = -100;
  const SWIPE_VELOCITY_THRESHOLD = 500;
  const handleDragEnd = (event, info) => {
    const { offset, velocity } = info;
    if (offset.y < SWIPE_THRESHOLD || velocity.y < -SWIPE_VELOCITY_THRESHOLD) {
      goToNext();
    }
  };
  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % equipos.length);
  };

  const currentEquipo = equipos[currentIndex];

  // --- Props de Drag (sin cambios) ---
  const dragProps = {
    drag: "y",
    dragConstraints: { top: 0, bottom: 0 },
    dragElastic: 0.2,
    onDragEnd: handleDragEnd,
  };

  // --- Variantes de Animación (sin cambios) ---
  const deckVariants = {
    initial: { opacity: 0, scale: 0.85, y: 80, zIndex: 0 },
    center: {
      opacity: 1, scale: 1, y: 0, zIndex: 1,
      transition: { duration: 0.4, ease: [0.48, 0.15, 0.25, 0.96] }
    },
    exit: {
      opacity: 0, scale: 0.85, y: -350, zIndex: 0,
      transition: { duration: 0.3, ease: [0.48, 0.15, 0.75, 0.56] }
    }
  };

  return (
    <div className="relative w-full max-w-xs mx-auto h-[450px] flex items-center justify-center overflow-hidden touch-pan-y">
      <AnimatePresence initial={false} custom={currentIndex}>
        {currentEquipo && (
           <motion.div
             key={currentIndex} // Crucial para AnimatePresence
             variants={deckVariants}
             initial="initial"
             animate="center"
             exit="exit"
             // Aplicamos las props de drag al motion.div
             drag={dragProps.drag}
             dragConstraints={dragProps.dragConstraints}
             dragElastic={dragProps.dragElastic}
             onDragEnd={dragProps.onDragEnd}
             className="absolute w-full h-[400px] cursor-grab active:cursor-grabbing" // Tamaño y cursor para drag
             style={{ top: '25px' }} // Centrado vertical
           >
             {/* DeckCard renderiza el contenido visual */}
             <DeckCard
               equipo={currentEquipo}
               isActive={true} // La tarjeta visible siempre está activa
             />
           </motion.div>
        )}
        {/* Mensaje si no hay equipos */}
        {!equipos || equipos.length === 0 && (
            <div className="text-center text-gray-500">No hay equipos para mostrar.</div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default EquipoDeckMobile;
