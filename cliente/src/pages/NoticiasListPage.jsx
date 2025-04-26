// src/pages/NoticiasListPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { usePublic } from '../context/PublicContex'; // Ajusta la ruta si es necesario
import LoadingSpinner from '../components/LoadingSpinner'; // Ajusta la ruta si es necesario
import { BACKEND_ORIGIN } from '../config';
import FormatDate from '../components/FormatDate'; // Ajusta la ruta si es necesario

// --- Componente para la Tarjeta Destacada (CORREGIDO) ---
const FeaturedNoticiaCard = ({ noticia }) => {
  if (!noticia) return null;
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8 md:mb-12 transition-transform duration-300 hover:scale-[1.02]">
      <Link to={`/web/noticias/${noticia._id}`}>
        {/* --- CORREGIDO: Usa foto_noti --- */}
        {noticia.foto_noti && noticia.foto_noti !== 'noticia.jpg' && ( // Opcional: No mostrar si es la default
          <img
            src={`${BACKEND_ORIGIN}/uploads/noticias/${noticia.foto_noti.replace(/\\/g, '/')}`}
            alt={noticia.tittle} // <-- CORREGIDO: Usa tittle
            className="w-full h-64 md:h-80 object-cover"
            loading="lazy"
          />
        )}
        {/* --- FIN CORRECCIÓN --- */}
        <div className="p-6 md:p-8">
          {/* --- CORREGIDO: Usa tittle --- */}
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-800 hover:text-blue-700">{noticia.tittle}</h2>
          {/* --- FIN CORRECCIÓN --- */}
          {/* <p className="text-gray-600 mb-4 line-clamp-3">{noticia.description || ''}</p> */} {/* Podrías mostrar description */}
          <div className="text-xs text-gray-500 mb-4">
            Publicado <FormatDate date={noticia.createdAt} /> {/* Asume createdAt */}
          </div>
          <span className="text-blue-600 hover:underline font-semibold">
            Leer más...
          </span>
        </div>
      </Link>
    </div>
  );
};

// --- Componente para la Tarjeta Normal en la Cuadrícula (CORREGIDO) ---
const NoticiaCard = ({ noticia }) => {
  if (!noticia) return null;
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col h-full transition-transform duration-300 hover:scale-105">
      <Link to={`/web/noticias/${noticia._id}`} className="flex flex-col h-full">
        {/* --- CORREGIDO: Usa foto_noti --- */}
        {noticia.foto_noti && noticia.foto_noti !== 'noticia.jpg' && ( // Opcional: No mostrar si es la default
          <img
            src={`${BACKEND_ORIGIN}/uploads/noticias/${noticia.foto_noti.replace(/\\/g, '/')}`}
            alt={noticia.tittle} // <-- CORREGIDO: Usa tittle
            className="w-full h-48 object-cover"
            loading="lazy"
          />
        )}
         {/* --- FIN CORRECCIÓN --- */}
        <div className="p-4 flex flex-col flex-grow">
          {/* --- CORREGIDO: Usa tittle --- */}
          <h3 className="text-lg font-semibold mb-2 text-gray-800 hover:text-blue-700 flex-grow line-clamp-3">{noticia.tittle}</h3>
          {/* --- FIN CORRECCIÓN --- */}
          <div className="text-xs text-gray-500 mb-3 mt-auto pt-2">
            <FormatDate date={noticia.createdAt} /> {/* Asume createdAt */}
          </div>
          <span className="text-blue-600 hover:underline text-sm font-medium">
            Leer más...
          </span>
        </div>
      </Link>
    </div>
  );
};


function NoticiasListPage() {
  const { publico: noticias, getNotis } = usePublic();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const limit = 9;

  useEffect(() => {
    const fetchNoticias = async () => {
      if (!noticias || noticias.length === 0) {
          setLoading(true);
          setError(null);
          try {
            await getNotis();
          } catch (err) {
            console.error("Error en NoticiasListPage al llamar a getNotis:", err);
            setError("No se pudieron cargar las noticias.");
          } finally {
            setLoading(false);
          }
      } else {
          setLoading(false);
      }
    };
    fetchNoticias();
  }, [getNotis, noticias]);

  const { featuredNoticia, restoDeNoticias } = useMemo(() => {
    if (!noticias || noticias.length === 0) {
      return { featuredNoticia: null, restoDeNoticias: [] };
    }
    // Ordena usando createdAt (de timestamps: true)
    const sortedNoticias = [...noticias].sort((a, b) =>
      new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    );
    return {
      featuredNoticia: sortedNoticias[0],
      restoDeNoticias: sortedNoticias.slice(1),
    };
  }, [noticias]);

  const noticiasMostradasEnGrid = useMemo(() => {
      return restoDeNoticias.slice(0, offset + limit);
  }, [restoDeNoticias, offset, limit]);

  const hasMore = noticiasMostradasEnGrid.length < restoDeNoticias.length;

  const handleVerMas = () => {
    setOffset((prevOffset) => prevOffset + limit);
  };

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
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-violet-800 mb-8 md:mb-12">
        Noticias
      </h1>

      {featuredNoticia && (
        <FeaturedNoticiaCard noticia={featuredNoticia} />
      )}

      {noticiasMostradasEnGrid && noticiasMostradasEnGrid.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {noticiasMostradasEnGrid.map((noticia) => (
              <NoticiaCard key={noticia._id} noticia={noticia} />
            ))}
          </div>

          {hasMore && (
            <div className="text-center mt-8 md:mt-12">
              <button
                onClick={handleVerMas}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
              >
                Ver más noticias
              </button>
            </div>
          )}
        </>
      ) : (
        !featuredNoticia && <p className="text-center text-gray-500 italic mt-8">No hay noticias publicadas por el momento.</p>
      )}
    </div>
  );
}

export default NoticiasListPage;
