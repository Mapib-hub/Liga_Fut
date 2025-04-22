// src/components/public/CarruselNoticias.jsx
import React from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import { BACKEND_ORIGIN } from '../../config'; // URL Base

function CarruselNoticias({ noticias }) {
  const settings = {
    dots: true, // Muestra puntos de navegación
    infinite: true, // Loop infinito
    speed: 500, // Velocidad de transición
    slidesToShow: 1, // Mostrar 1 slide a la vez
    slidesToScroll: 1, // Mover 1 slide a la vez
    autoplay: true, // Reproducción automática
    autoplaySpeed: 5000, // Cambiar cada 5 segundos
    pauseOnHover: true, // Pausar al pasar el mouse
    adaptiveHeight: true, // Ajustar altura al contenido
    appendDots: dots => ( // Estilo personalizado para los puntos
        <div style={{ bottom: "15px" }}>
          <ul style={{ margin: "0px" }}> {dots} </ul>
        </div>
      ),
     customPaging: i => ( // Estilo de cada punto
        <div className="w-2 h-2 bg-white rounded-full opacity-50 slick-dots-custom"></div>
     )
  };

  // Estilo para superponer texto sobre imagen
  const overlayStyle = "absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-90";
  const textContainerStyle = "absolute bottom-0 left-0 p-4 md:p-8 text-white z-10";
  const titleStyle = "text-xl md:text-3xl lg:text-4xl font-bold mb-2 leading-tight shadow-text";
  const descriptionStyle = "text-sm md:text-base hidden sm:block max-w-prose shadow-text"; // Oculta descripción en móviles pequeños

  return (
    <div className="relative"> {/* Contenedor relativo para posicionar overlay y texto */}
      <Slider {...settings}>
        {noticias.map((noti) => (
          <div key={noti._id} className="relative h-[50vh] md:h-[70vh] lg:h-[80vh] focus:outline-none"> {/* Altura del carrusel */}
            <img
              src={`${BACKEND_ORIGIN}/uploads/noticias/${noti.foto_noti}`}
              alt={noti.tittle}
              className="w-full h-full object-cover" // Cubrir todo el espacio
            />
            <div className={overlayStyle}></div> {/* Capa oscura */}
            <div className={textContainerStyle}>
              <h2 className={titleStyle}>{noti.tittle}</h2>
              <p className={descriptionStyle}>
                {noti.description.length > 150 ? `${noti.description.substring(0, 150)}...` : noti.description}
              </p>
              <Link
                to={`/noticias/${noti._id}`} // Asume ruta /noticias/:id para el detalle
                className="mt-3 inline-block bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm font-semibold py-2 px-4 rounded transition duration-200"
              >
                Leer Más
              </Link>
            </div>
          </div>
        ))}
      </Slider>
     
    </div>
  );
}

export default CarruselNoticias;
