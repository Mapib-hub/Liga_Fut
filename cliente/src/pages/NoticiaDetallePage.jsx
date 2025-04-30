// src/pages/NoticiaDetallePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // Link para posible botón "volver"
import { usePublic } from '../context/PublicContex'; // Ajusta la ruta
import LoadingSpinner from '../components/LoadingSpinner'; // Ajusta la ruta
import { BACKEND_ORIGIN } from '../config';
import FormatDate from '../components/FormatDate'; // Ajusta la ruta
import { FiImage } from 'react-icons/fi'; // Icono para placeholder de imagen
import EspacioPublicidad from '../components/public/EspacioPublicidad';

function NoticiaDetallePage() {
  const { id } = useParams();
  const { getNoti } = usePublic(); // Función para obtener una noticia

  const [noticia, setNoticia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNoticiaDetalle = async () => {
      setLoading(true);
      setError(null);
      setNoticia(null); // Limpia noticia previa
      try {
        const data = await getNoti(id);
        if (data) {
          setNoticia(data);
        } else {
          throw new Error('No se encontró la noticia.');
        }
      } catch (err) {
        console.error("Error en NoticiaDetallePage:", err);
        setError(err.message || 'Hubo un problema al cargar la noticia.');
      } finally {
        setLoading(false);
      }
    };

    fetchNoticiaDetalle();
  }, [id, getNoti]); // Dependencias

  // --- Renderizado Condicional ---
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-600">
        <p><strong>Error:</strong> {error}</p>
        <Link to="/web/noticias" className="text-blue-600 hover:underline mt-4 inline-block">
          Volver a Noticias
        </Link>
      </div>
    );
  }

  if (!noticia) {
    // Si no hay error pero tampoco noticia (poco probable si getNoti devuelve null en error)
    return (
      <div className="container mx-auto px-4 py-8 text-center text-gray-500">
        <p>No se encontró la noticia solicitada.</p>
        <Link to="/web/noticias" className="text-blue-600 hover:underline mt-4 inline-block">
          Volver a Noticias
        </Link>
      </div>
    );
  }

  // --- Renderizado del Artículo ---
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Contenedor principal del artículo con ancho máximo para lectura */}
      <article className="max-w-3xl mx-auto bg-white p-6 md:p-10 rounded-lg shadow-lg">

        {/* Título */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-violet-800 mb-4 leading-tight">
          {noticia.tittle}
        </h1>

        {/* Fecha de Publicación */}
        <div className="text-sm text-gray-500 mb-6 border-b pb-4">
          Publicado <FormatDate date={noticia.createdAt} />
          {/* Aquí podrías añadir el autor si lo tuvieras: por {noticia.user?.nombre} */}
        </div>

        {/* Imagen Principal (si existe y no es la default) */}
        {noticia.foto_noti && noticia.foto_noti !== 'noticia.jpg' && (
          <div className="mb-8">
            <img
              src={`${BACKEND_ORIGIN}/uploads/noticias/${noticia.foto_noti.replace(/\\/g, '/')}`}
              alt={noticia.tittle}
              className="w-full h-auto rounded-lg shadow-md object-cover" // h-auto para mantener proporción
              loading="lazy"
            />
          </div>
        )}
        {/* Placeholder si no hay imagen o es la default */}
        {(!noticia.foto_noti || noticia.foto_noti === 'noticia.jpg') && (
           <div className="mb-8 flex justify-center items-center bg-gray-100 rounded-lg h-64 text-gray-400">
               <FiImage size={50} />
           </div>
        )}


        {/* Cuerpo de la Noticia */}
        {/* Usamos 'prose' de Tailwind para estilos de texto predefinidos, o estilos manuales */}
        <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
          {/* Aquí asumimos que 'description' puede contener saltos de línea */}
          {/* Si 'description' es HTML, necesitarías dangerouslySetInnerHTML (con cuidado) */}
          {/* Si es texto plano con saltos de línea: */}
          {noticia.description.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4">{paragraph}</p>
          ))}
        </div>

        {/* Botón opcional para volver */}
        <div className="mt-8 pt-6 border-t text-center">
            <Link to="/web/noticias" className="text-blue-600 hover:underline">
                &larr; Volver a todas las noticias
            </Link>
        </div>

      </article>
      <div className="container mx-auto px-4 pb-12">
        {/* --- MODIFICADO AQUÍ --- */}
        {/* Aplicamos grid y 2 columnas POR DEFECTO (móvil) */}
        {/* Luego, en 'lg', cambiamos a 12 columnas */}
        {/* Añadimos un gap para móvil y mantenemos el de lg */}
        <div className='grid grid-cols-2 gap-4 lg:grid-cols-12 lg:gap-4 items-start'>

          {/* Anuncio 1: Ocupa 1 celda en móvil (automático), 2 en lg */}
          {/* --- MODIFICADO: Removido mb-4, ya que gap-4 lo maneja --- */}
          <div className="lg:col-span-2 lg:mb-0">
            <EspacioPublicidad
              imagenSrc="/imagenes/imagen_01.jpg" // ¡Verifica ruta!
              altPublicidad="Anuncio de Ejemplo 1"
            />
          </div>
          {/* Espacio vacío 1: Sigue oculto en móvil */}
          <div className="hidden lg:block lg:col-span-1"></div> {/* <--- ESPACIO VACÍO */}

          {/* Anuncio 2: Ocupa 1 celda en móvil (automático), 2 en lg */}
          {/* --- MODIFICADO: Removido mb-4 --- */}
          <div className="lg:col-span-2 lg:mb-0">
            <EspacioPublicidad
              imagenSrc="/imagenes/imagen_02.jpg" // ¡Verifica ruta!
              altPublicidad="Anuncio de Ejemplo 2"
            />
          </div>
          {/* Espacio vacío 2: Sigue oculto en móvil */}
          <div className="hidden lg:block lg:col-span-1"></div> {/* <--- ESPACIO VACÍO */}

          {/* Anuncio 3: Ocupa 1 celda en móvil (automático), 2 en lg */}
          {/* --- MODIFICADO: Removido mb-4 --- */}
          <div className="lg:col-span-2 lg:mb-0">
            <EspacioPublicidad
              imagenSrc="/imagenes/imagen_03.jpg" // ¡Verifica ruta!
              altPublicidad="Anuncio de Ejemplo 3"
            />
          </div>
          {/* Espacio vacío 3: Sigue oculto en móvil */}
          <div className="hidden lg:block lg:col-span-1"></div> {/* <--- ESPACIO VACÍO */}

          {/* Anuncio 4: Ocupa 1 celda en móvil (automático), 2 en lg */}
          {/* --- MODIFICADO: Removido mb-4 --- */}
          <div className="lg:col-span-2 lg:mb-0">
            <EspacioPublicidad
              imagenSrc="/imagenes/imagen_04.jpg" // ¡Verifica ruta!
              altPublicidad="Anuncio de Ejemplo 4"
            />
          </div>
          {/* Espacio vacío 4: Sigue oculto en móvil */}
          {/* Considera si necesitas este último espacio en lg */}
          <div className="hidden lg:block lg:col-span-1"></div> {/* <--- ESPACIO VACÍO */}

        </div> {/* Cierre del grid */}

      </div> {/* Cierre del container de publicidad */}
    </div>
  );
}

export default NoticiaDetallePage;
