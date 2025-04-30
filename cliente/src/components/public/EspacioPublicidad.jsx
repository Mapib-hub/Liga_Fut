import React from 'react';

// Este es nuestro componente reutilizable para mostrar imágenes promocionales.
// Recibe la ruta de la imagen (imagenSrc) y un texto alternativo (altPublicidad) como props.
function EspacioPublicidad({ imagenSrc, altPublicidad }) {
  // Validamos que nos hayan pasado la imagenSrc antes de intentar mostrar algo
  if (!imagenSrc) {
    // Podríamos mostrar un mensaje o simplemente nada si no hay imagen
    console.warn("EspacioPublicidad: No se proporcionó imagenSrc.");
    return null; // No renderizar nada si no hay ruta de imagen
  }

  return (
    // Usamos un div contenedor con una clase genérica para evitar bloqueadores
    <div className="promo-espacio">
      <img
        src={imagenSrc}
        alt={altPublicidad || 'Espacio promocional'} // Usar un alt por defecto si no se proporciona
        className="promo-imagen" // Clase genérica para la imagen
      />
    </div>
  );
}

export default EspacioPublicidad;
