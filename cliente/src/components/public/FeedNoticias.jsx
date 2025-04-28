// src/components/public/FeedNoticias.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { BACKEND_ORIGIN } from '../../config';
import FormatDate from '../FormatDate'; // Reutilizamos

function FeedNoticias({ noticias }) {
  if (!noticias || noticias.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Más Noticias</h3>
        <p className="text-sm text-gray-500 italic">No hay más noticias por el momento.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 md:p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">Más Noticias</h3>
        <Link to="/web/noticias" className="text-blue-600 hover:text-blue-800 text-sm font-semibold">
          Ver Todas →
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {noticias.map((noti) => (
          <Link to={`/web/noticias/${noti._id}`} key={noti._id} className="group block bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-200">
            <div className="h-40 overflow-hidden">
              <img
                src={`${BACKEND_ORIGIN}/uploads/noticias/${noti.foto_noti}`}
                alt={noti.tittle}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => e.target.src = '/default-news.jpg'} // Imagen por defecto
              />
            </div>
            <div className="p-4">
              <h4 className="font-semibold text-md text-gray-800 mb-1 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                {noti.tittle}
              </h4>
              <p className="text-xs text-gray-500 mb-2">
                <FormatDate date={noti.createdAt} />
                {noti.user?.username && ` - por ${noti.user.username}`}
              </p>
              <p className="text-sm text-gray-600 line-clamp-3"> {/* Muestra 3 líneas */}
                {noti.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default FeedNoticias;
