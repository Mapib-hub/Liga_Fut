// src/hooks/useScreenSize.js
import { useState, useEffect } from 'react';

// Define el punto de corte (breakpoint) para considerar "móvil"
// Usaremos 768px, que es el breakpoint 'md' de Tailwind por defecto.
// Puedes ajustar este valor si prefieres otro punto de corte.
const MOBILE_BREAKPOINT = 768;

function useScreenSize() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_BREAKPOINT);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Añadir listener para cambios de tamaño
    window.addEventListener('resize', handleResize);

    // Limpiar el listener cuando el componente se desmonte
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // El array vacío asegura que el efecto se configure solo una vez

  return { isMobile };
}

export default useScreenSize;
