// src/components/public/EquipoCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'; // Para enlazar a detalles del equipo (opcional)
import { BACKEND_ORIGIN } from '../../config'; // URL del backend
import { FiShieldOff } from 'react-icons/fi'; // Icono para placeholder

// Componente para renderizar la imagen o el placeholder
const RenderEscudo = ({ equipo }) => {
  if (!equipo || !equipo.foto_equipo) {
    // Placeholder si no hay foto_equipo
    return (
      <div className="h-24 w-24 mb-3 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
        <FiShieldOff size={40} /> {/* Icono de escudo desactivado */}
      </div>
    );
  }

  return (
    <img
      className="h-24 w-24 mb-3 object-contain rounded-full bg-white p-1 shadow-sm" // Contener imagen, fondo blanco si es transparente
      src={`${BACKEND_ORIGIN}/uploads/equipos/${equipo.foto_equipo}`}
      alt={`Escudo de ${equipo.nombre}`}
      // onError: Oculta la imagen si falla y muestra el placeholder (requiere un estado o ref para hacerlo bien)
      // Simplificación: Dejamos que muestre el icono roto si falla la carga, o podrías añadir lógica onError más compleja.
      // onError={(e) => { e.target.style.display = 'none'; /* Aquí podrías mostrar el placeholder */ }}
      loading="lazy" // Carga diferida para imágenes que no están en pantalla
    />
  );
};


function EquipoCard({ equipo }) {
  // Configuración de la animación con Framer Motion
  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 }, // Estado inicial (invisible, abajo, pequeño)
    visible: { // Estado final (visible, en posición, tamaño normal)
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5, // Duración de la animación
        ease: "easeOut" // Tipo de suavizado
      }
    }
  };

  return (
    // Usamos motion.div para aplicar la animación
    <motion.div
      variants={cardVariants}
      initial="hidden" // Empieza oculto
      whileInView="visible" // Anima a 'visible' cuando entra en la pantalla
      viewport={{ once: true, amount: 0.2 }} // La animación se dispara una vez cuando el 20% es visible
      className="flex flex-col items-center" // Contenedor para centrar Link si se usa
    >
      {/* Envolvemos la tarjeta en un Link si queremos ir a detalles */}
      {/* Si no tienes página de detalles, puedes quitar el Link */}
      <Link
        to={`/web/equipos/${equipo._id}`} // Ruta de ejemplo para detalles
        className="block w-full bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300 ease-in-out transform hover:-translate-y-1"
      >
        <div className="p-5 flex flex-col items-center text-center">
          <RenderEscudo equipo={equipo} />
          <h3 className="font-semibold text-gray-800 text-base leading-tight truncate w-full" title={equipo.nombre}>
            {equipo.nombre}
          </h3>
          {/* Podrías añadir más info aquí si la tienes (ciudad, etc.) */}
          {/* <p className="text-xs text-gray-500 mt-1">{equipo.ciudad || ''}</p> */}
        </div>
      </Link>
    </motion.div>
  );
}

export default EquipoCard;
