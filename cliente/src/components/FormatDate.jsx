// src/components/FormatDate.jsx
import React from 'react';
// Opcional: Importar PropTypes para validación
// import PropTypes from 'prop-types';

/**
 * Componente para formatear una fecha en formato DD/MM/YYYY español.
 * @param {object} props
 * @param {string|Date} props.date - La fecha a formatear (puede ser string ISO, objeto Date).
 * @param {string} [props.fallback='N/A'] - Texto a mostrar si la fecha es inválida o nula.
 */
const FormatDate = ({ date, fallback = 'N/A' }) => {

  // Si no hay fecha, devuelve el texto de fallback
  if (!date) {
    return <>{fallback}</>; // Usamos fragmento por si fallback es JSX
  }

  try {
    const dateObj = new Date(date); // Intenta crear un objeto Date

    // Verifica si la fecha es válida
    if (isNaN(dateObj.getTime())) {
      console.warn("FormatDate Component: Received invalid date value:", date);
      return <>{fallback}</>; // Devuelve fallback si la fecha no es válida
    }

    // Opciones para el formato DD/MM/YYYY
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    };

    // Formatea usando el locale español ('es-ES' o 'es')
    const formattedDate = dateObj.toLocaleDateString('es-ES', options);

    // Devuelve la fecha formateada
    return <>{formattedDate}</>;

  } catch (error) {
    console.error("FormatDate Component: Error formatting date:", date, error);
    return <>{fallback}</>; // Devuelve fallback en caso de error
  }
};

// Opcional: Definir PropTypes para mejor documentación y validación en desarrollo
// FormatDate.propTypes = {
//   date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
//   fallback: PropTypes.string,
// };

export default FormatDate;
