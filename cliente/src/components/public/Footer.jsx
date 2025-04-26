// src/components/public/layout/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa'; // Importa iconos

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          {/* Columna 1: Logo y Descripción */}
          <div className="space-y-4">
            <Link to="/" className="text-white text-2xl font-bold hover:opacity-80 transition-opacity">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                Mi Liga Pro
              </span>
            </Link>
            <p className="text-sm">
              Toda la información de tu liga favorita. Resultados, noticias, estadísticas y más.
            </p>
          </div>

          {/* Columna 2: Navegación Rápida */}
          <div>
            <h3 className="text-md font-semibold text-gray-200 mb-4 uppercase tracking-wider">Navegación</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/web/tabla" className="hover:text-white transition-colors">Tabla de Posiciones</Link></li>
              <li><Link to="/web/calendario" className="hover:text-white transition-colors">Calendario</Link></li>
              <li><Link to="/web/noticias" className="hover:text-white transition-colors">Noticias</Link></li>
              <li><Link to="/web/equipos" className="hover:text-white transition-colors">Equipos</Link></li>
              <li><Link to="/web/estadisticas" className="hover:text-white transition-colors">Estadísticas</Link></li>
            </ul>
          </div>

          {/* Columna 3: Legal/Otros */}
          <div>
            <h3 className="text-md font-semibold text-gray-200 mb-4 uppercase tracking-wider">Información</h3>
            <ul className="space-y-2 text-sm">
              {/* Añade enlaces reales si los tienes */}
              <li><a href="#" className="hover:text-white transition-colors">Acerca de Nosotros</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Política de Privacidad</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Términos de Servicio</a></li>
            </ul>
          </div>

          {/* Columna 4: Redes Sociales */}
          <div>
            <h3 className="text-md font-semibold text-gray-200 mb-4 uppercase tracking-wider">Síguenos</h3>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-blue-500 transition-colors text-xl">
                <FaFacebookF />
              </a>
              <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-sky-400 transition-colors text-xl">
                <FaTwitter />
              </a>
              <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-pink-500 transition-colors text-xl">
                <FaInstagram />
              </a>
              <a href="#" aria-label="YouTube" className="text-gray-400 hover:text-red-600 transition-colors text-xl">
                <FaYoutube />
              </a>
            </div>
            {/* Podrías añadir un campo de suscripción a newsletter aquí */}
          </div>

        </div>

        {/* Barra Inferior: Copyright */}
        <div className="border-t border-gray-700 pt-8 mt-8 text-center text-sm">
          <p>&copy; {currentYear} Mi Liga Pro. Todos los derechos reservados.</p>
          {/* <p>Desarrollado con ❤️ por [Tu Nombre/Equipo]</p> */}
        </div>
      </div>
    </footer>
  );
}

export default Footer;

