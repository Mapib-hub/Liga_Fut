// src/components/public/RenderJugadorFoto.jsx
import React from 'react';
import { BACKEND_ORIGIN } from '../../config';
import { FiUser } from 'react-icons/fi'; // Icono para placeholder

function RenderJugadorFoto({ jugador, className = "h-10 w-10" }) { // Tamaño por defecto

  // Placeholder con icono FiUser
  const Placeholder = () => (
    <div className={`${className} flex items-center justify-center bg-gray-200 text-gray-400 rounded-full select-none`}>
      <FiUser size="60%" /> {/* Tamaño relativo del icono */}
    </div>
  );

  // Si no hay jugador o no hay foto_jug (y no es el default 'player.jpg' si queremos tratarlo diferente)
  // Considera si 'player.jpg' debe mostrar el placeholder o la imagen genérica. Aquí muestra placeholder.
  if (!jugador || !jugador.foto_jug ) {
    return <Placeholder />;
  }

  const imageUrl = `${BACKEND_ORIGIN}/uploads/jugadores/${jugador.foto_jug.replace(/\\/g, '/')}`;

  return (
    <img
      src={imageUrl}
      alt={`${jugador.nombre || ''} ${jugador.apellido || ''}`}
      // Aplicamos lazy loading y las clases de tamaño/estilo
      className={`${className} object-cover rounded-full select-none shadow-sm`}
      loading="lazy" // <-- ¡Lazy Loading!
      onError={(e) => {
        // Si la imagen falla, mostramos el placeholder en lugar de la imagen rota
        e.target.onerror = null; // Previene bucles
        e.target.style.display = 'none'; // Oculta img rota

        const parent = e.target.parentElement;
        // Evita añadir múltiples fallbacks si hay re-renders rápidos
        if (parent && !parent.querySelector('.placeholder-fallback')) {
          const fallback = document.createElement('div');
          // Asegura que el fallback tenga las mismas clases de tamaño/estilo
          fallback.className = `${className} flex items-center justify-center bg-gray-200 text-gray-400 rounded-full select-none placeholder-fallback`;
          // Icono SVG como innerHTML (asegúrate que el SVG sea seguro si viene de fuente externa)
          fallback.innerHTML = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="60%" width="60%" xmlns="http://www.w3.org/2000/svg"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"></path></svg>`;
          parent.insertBefore(fallback, e.target);
        }
      }}
    />
  );
}

export default RenderJugadorFoto;
