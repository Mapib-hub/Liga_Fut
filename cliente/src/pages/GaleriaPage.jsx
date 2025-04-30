// src/pages/GaleriaPage.jsx
import React, { useState } from 'react'; // Importa useState
import Lightbox from "yet-another-react-lightbox"; // Importa Lightbox
import "yet-another-react-lightbox/styles.css"; // Importa los estilos del Lightbox

// --- Lista de nombres de archivo de las imágenes en public/jugadas/ ---
// Ajusta el número final si tienes más o menos de 20 fotos
const numeroDeImagenes = 20;
const nombresImagenes = Array.from(
  { length: numeroDeImagenes },
  (_, i) => `imagen_${String(i + 1).padStart(2, '0')}.jpg`
);
// Esto crea: ['imagen_01.jpg', 'imagen_02.jpg', ..., 'imagen_20.jpg']

// --- Texto descriptivo (Puedes cambiarlo) ---
const textoDescriptivo = `
  Revive los mejores momentos de nuestro torneo a través de esta colección
  especial de fotografías. Capturamos la pasión, el esfuerzo y la alegría
  que definen a nuestra liga. ¡Disfruta de las mejores jugadas, celebraciones
  y la camaradería que nos une!
`;

// --- Prepara los datos para el Lightbox ---
// ¡¡IMPORTANTE!! Verifica que la ruta '/jugadas/' sea correcta y que las imágenes estén ahí.
const slides = nombresImagenes.map(nombreArchivo => ({
  src: `/jugadas/${nombreArchivo}` // Usando la ruta del contexto
}));

function GaleriaPage() {
  // --- Estados para controlar el Lightbox ---
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0); // Índice de la foto a mostrar

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-violet-800 mb-8 md:mb-12">
        Galería de Fotos
      </h1>

      {/* Contenedor principal del layout (Texto | Grid de Fotos) */}
      <div className="lg:grid lg:grid-cols-12 lg:gap-8">

        {/* Columna Izquierda: Texto Descriptivo */}
        <div className="lg:col-span-6 mb-8 lg:mb-0">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Momentos Inolvidables
            </h2>
            {/* Usamos whitespace-pre-line para respetar saltos de línea en el texto */}
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {textoDescriptivo}
            </p>
            {/* Podrías añadir más texto o elementos aquí si quisieras */}
          </div>
        </div>

        {/* Columna Derecha: Grid de Miniaturas */}
        <div className="lg:col-span-6">
          {/* Grid interno para las miniaturas */}
          {/* 2 columnas en móvil, 4 en pantallas medianas y grandes */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {nombresImagenes.map((nombreArchivo, idx) => ( // Cambiado 'index' a 'idx'
              <div
                key={idx}
                className="aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                // --- Añade onClick para abrir el Lightbox ---
                onClick={() => {
                  setIndex(idx); // Establece el índice de la imagen clickeada
                  setOpen(true); // Abre el lightbox
                }}
              >
                <img
                  // ¡¡IMPORTANTE!! Verifica que la ruta '/jugadas/' sea correcta.
                  src={`/jugadas/${nombreArchivo}`} // Usando la ruta del contexto
                  alt={`Imagen ${idx + 1} de la galería`}
                  className="w-full h-full object-cover" // object-cover asegura que la imagen llene el espacio sin distorsionarse
                  loading="lazy" // Carga diferida para mejorar rendimiento
                  onError={(e) => {
                    // Opcional: Ocultar si la imagen no carga
                    e.target.parentElement.style.display = 'none';
                    // Actualizado el mensaje de error para usar la ruta correcta
                    console.warn(`No se pudo cargar la imagen: /jugadas/${nombreArchivo}`);
                  }}
                />
              </div>
            ))}
          </div>
        </div>

      </div> {/* Fin del grid principal lg:grid-cols-12 */}

      {/* --- Componente Lightbox --- */}
      {/* Se renderiza aquí pero se muestra como un overlay */}
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={slides}
        index={index}
        // Puedes añadir plugins aquí si quieres (ej: zoom, thumbnails)
        // import Zoom from "yet-another-react-lightbox/plugins/zoom";
        // plugins={[Zoom]}
      />

    </div> // Fin del container principal
  );
}

export default GaleriaPage;
