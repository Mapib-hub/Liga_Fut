// src/components/public/EquipoStats.jsx
import React from 'react';
// 1. Importar la librería y sus estilos
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

// Componente para mostrar una estadística individual (PJ, PG, PE, PP)
const StatItem = ({ label, value }) => (
  <div className="text-center px-2">
    <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider">{label}</p>
    <p className="text-xl sm:text-2xl font-bold text-gray-800">{value ?? '-'}</p> {/* Muestra '-' si el valor es null/undefined */}
  </div>
);

function EquipoStats({ estadisticas }) {
  // 2. Verificar si tenemos datos de estadísticas
  if (!estadisticas) {
    return <p className="text-gray-500 italic text-center py-4">Estadísticas no disponibles.</p>;
  }

  // ----- LÍNEA MODIFICADA PARA INCLUIR GOLES -----
  const { jugados = 0, pg = 0, pe = 0, pp = 0, gf = 0, gc = 0, dg = 0 } = estadisticas;
 // Usamos 0 como default si falta algún dato

  // 3. Calcular el % Valoración (Efectividad)
  const puntosObtenidos = (pg * 3) + (pe * 1);
  const puntosMaximos = jugados * 3;
  // Evitar división por cero si no hay partidos jugados
  const porcentaje = puntosMaximos > 0 ? Math.round((puntosObtenidos / puntosMaximos) * 100) : 0;

  // 4. Renderizar el componente
  return (
    <div className="flex flex-col items-center gap-6 md:gap-8"> {/* Contenedor principal */}

      {/* Círculo de Progreso */}
      <div className="w-32 h-32 sm:w-40 sm:h-40"> {/* Tamaño del círculo */}
        <CircularProgressbar
          value={porcentaje}
          text={`${porcentaje}%`} // Texto dentro del círculo
          styles={buildStyles({
            // Colores (puedes personalizarlos)
            pathColor: `rgba(59, 130, 246, ${porcentaje / 100})`, // Azul, opacidad según %
            textColor: '#3B82F6', // Azul para el texto
            trailColor: '#d6d6d6', // Color del fondo del círculo
            backgroundColor: '#f0f0f0', // Color de fondo (si usas background prop)

            // Estilo del texto
            textSize: '20px', // Tamaño del texto
          })}
        />
        <p className="text-center text-xs text-gray-500 mt-1 uppercase tracking-wider">Efectividad</p>
      </div>

      {/* Grid para las otras estadísticas (PJ, PG, PE, PP) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 w-full max-w-lg"> {/* Aumenté un poco max-w */}
        <StatItem label="jugados" value={jugados} />
        <StatItem label="PG" value={pg} />
        <StatItem label="PE" value={pe} />
        <StatItem label="PP" value={pp} />
    </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 w-full max-w-lg"> {/* Aumenté un poco max-w */}
         {/* ////// NUEVOS ITEMS AÑADIDOS ////// */}
       <StatItem label="GF" value={gf} /> {/* Goles a Favor */}
        <StatItem label="GC" value={gc} /> {/* Goles en Contra */}
        <StatItem label="DG" value={dg} /> {/* Diferencia de Goles */}
    </div>
      

    </div>
  );
}

export default EquipoStats;
