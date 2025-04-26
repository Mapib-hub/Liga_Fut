// src/components/public/AlertBanner.jsx
import React from 'react';
// Importamos los iconos que usaremos. Asegúrate de tener instalado react-icons:
// npm install react-icons
import { FaExclamationTriangle, FaInfoCircle, FaTimesCircle } from 'react-icons/fa';

/**
 * Componente para mostrar un banner de alerta/información.
 * Cambia de color e icono según el tipo de mensaje.
 * @param {object} props - Propiedades del componente.
 * @param {string} props.message - El mensaje a mostrar en el banner.
 * @param {'info' | 'warning' | 'error'} [props.type='info'] - El tipo de alerta, determina el estilo.
 */
function AlertBanner({ message, type = 'info' }) {
  let bgColor, borderColor, textColor, IconComponent;

  // Determinamos los estilos y el icono según el tipo de alerta
  switch (type.toLowerCase()) { // Usamos toLowerCase para ser flexibles (info, Info, INFO)
    case 'warning':
      bgColor = 'bg-yellow-100';       // Fondo amarillo pálido
      borderColor = 'border-yellow-400'; // Borde izquierdo amarillo más oscuro
      textColor = 'text-yellow-700';     // Texto amarillo oscuro
      IconComponent = FaExclamationTriangle; // Icono de advertencia
      break;
    case 'error':
      bgColor = 'bg-red-100';           // Fondo rojo pálido
      borderColor = 'border-red-400';     // Borde izquierdo rojo más oscuro
      textColor = 'text-red-700';         // Texto rojo oscuro
      IconComponent = FaTimesCircle;      // Icono de error/cruz
      break;
    case 'info':
    default: // Si el tipo no es reconocido o es 'info', usamos el estilo informativo
      bgColor = 'bg-blue-100';          // Fondo azul pálido
      borderColor = 'border-blue-400';    // Borde izquierdo azul más oscuro
      textColor = 'text-blue-700';        // Texto azul oscuro
      IconComponent = FaInfoCircle;       // Icono de información
      break;
  }

  // Podríamos añadir lógica para hacerlo "cerrable" en el futuro si fuera necesario
  // const [isVisible, setIsVisible] = useState(true);
  // if (!isVisible) return null;

  return (
    // Contenedor principal del banner
    <div
      // Aplicamos las clases de Tailwind calculadas dinámicamente
      className={`border-l-4 ${borderColor} ${bgColor} p-4 rounded-md shadow-sm flex items-center space-x-3`}
      role="alert" // Rol semántico para accesibilidad
    >
      {/* Icono */}
      <IconComponent
        className={`h-5 w-5 ${textColor} flex-shrink-0`} // flex-shrink-0 evita que el icono se encoja
        aria-hidden="true" // Ocultamos el icono a lectores de pantalla (el texto es suficiente)
      />
      {/* Mensaje */}
      <p className={`text-sm font-medium ${textColor}`}>
        {message}
      </p>
      {/* Botón opcional para cerrar (comentado por ahora)
      <button
        onClick={() => setIsVisible(false)}
        className={`ml-auto -mx-1.5 -my-1.5 ${bgColor} ${textColor} rounded-lg focus:ring-2 focus:ring-offset-2 p-1.5 inline-flex h-8 w-8`}
        aria-label="Dismiss"
      >
        <span className="sr-only">Dismiss</span>
        <FaTimesCircle className="h-5 w-5" />
      </button>
      */}
    </div>
  );
}

export default AlertBanner;
