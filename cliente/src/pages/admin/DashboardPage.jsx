// src/pages/admin/DashboardPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useEquipos } from '../../context/EquiposContext';
import { useJugador } from '../../context/JugadorContext';
import { useNotis } from '../../context/NotisContext';
import { useCalen } from '../../context/CalendarioContext';
import { BACKEND_ORIGIN } from '../../config';

// --- Iconos (Ejemplo usando Heroicons - necesitarías instalar @heroicons/react) ---
// import { CalendarIcon, NewspaperIcon, ShieldCheckIcon, StarIcon, UsersIcon, TrophyIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
// --- O usa SVGs simples o caracteres por ahora ---
const CalendarIcon = () => <span>📅</span>;
const NewspaperIcon = () => <span>📰</span>;
const ShieldCheckIcon = () => <span>🛡️</span>;
const StarIcon = () => <span>⭐</span>;
const UsersIcon = () => <span>👥</span>;
const TrophyIcon = () => <span>🏆</span>;
const ArrowRightIcon = () => <span>➡️</span>;
const ChartBarIcon = () => <span>📊</span>; // Para Equipo más goleador

// --- Componente Widget Genérico (Opcional, para estilo base) ---
const WidgetCard = ({ title, icon, children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-md p-4 md:p-6 ${className}`}>
    <div className="flex items-center text-gray-600 mb-3">
      {icon && <div className="mr-2">{icon}</div>}
      <h3 className="text-lg font-semibold">{title}</h3>
    </div>
    <div className="text-gray-800">
      {children}
    </div>
  </div>
);

// --- Widget: Próxima Jornada ---
const ProximaJornadaWidget = ({ partidos }) => {
  const [proximoPartido, setProximoPartido] = useState(null);

  useEffect(() => {
    // Encuentra el primer partido pendiente (simplificado para v1)
    const pendiente = partidos?.find(p => p.estado === 'Pendiente');
    setProximoPartido(pendiente);
  }, [partidos]);

  const renderInsignia = (equipo) => {
    if (!equipo || !equipo.foto_equipo) return <div className="h-8 w-8 bg-gray-300 rounded-full inline-block"></div>;
    return (
        <img
            className="h-8 w-8 object-contain inline-block rounded-full"
            src={`${BACKEND_ORIGIN}/uploads/equipos/${equipo.foto_equipo}`}
            alt={equipo.nombre}
            onError={(e) => e.target.style.display = 'none'}
        />
    );
  };

  return (
    <WidgetCard title="Próximo Partido" icon={<CalendarIcon />}>
      {proximoPartido ? (
        <div>
          <div className="flex items-center justify-around text-center mb-3">
            <div className="flex flex-col items-center">
              {renderInsignia(proximoPartido.equipo_local)}
              <span className="mt-1 text-sm font-medium">{proximoPartido.equipo_local?.nombre || 'N/A'}</span>
            </div>
            <span className="text-xl font-bold text-gray-500">vs</span>
            <div className="flex flex-col items-center">
              {renderInsignia(proximoPartido.equipo_visitante)}
              <span className="mt-1 text-sm font-medium">{proximoPartido.equipo_visitante?.nombre || 'N/A'}</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 text-center mb-3">
            {proximoPartido.fecha?.nombre || ''} {proximoPartido.lugar ? `- ${proximoPartido.lugar}` : ''}
          </p>
          <Link
            to="/admin/calendario" // Ajusta si la ruta de gestión es diferente
            className="block w-full text-center bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold py-2 px-4 rounded transition duration-200"
          >
            Gestionar Calendario
          </Link>
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic">No hay partidos pendientes programados.</p>
      )}
    </WidgetCard>
  );
};

// --- Widget: Clasificación Rápida ---
const ClasificacionWidget = ({ equipos }) => {
  const [topEquipos, setTopEquipos] = useState([]);

  useEffect(() => {
    if (equipos) {
      const sorted = [...equipos].sort((a, b) => (b.puntos ?? 0) - (a.puntos ?? 0));
      setTopEquipos(sorted.slice(0, 5)); // Top 5
    }
  }, [equipos]);

  const renderInsignia = (equipo) => {
    if (!equipo || !equipo.foto_equipo) return <div className="h-5 w-5 bg-gray-300 rounded-full inline-block mr-2"></div>;
    return (
        <img
            className="h-5 w-5 object-contain inline-block mr-2 rounded-full"
            src={`${BACKEND_ORIGIN}/uploads/equipos/${equipo.foto_equipo}`}
            alt={equipo.nombre}
            onError={(e) => e.target.style.display = 'none'}
        />
    );
  };

  return (
    <WidgetCard title="Clasificación Rápida" icon={<TrophyIcon />}>
      {topEquipos.length > 0 ? (
        <ul className="space-y-2">
          {topEquipos.map((equipo, index) => (
            <li key={equipo._id} className="flex justify-between items-center text-sm">
              <div className="flex items-center">
                <span className="font-semibold w-6 mr-1">{index + 1}.</span>
                {renderInsignia(equipo)}
                <span>{equipo.nombre}</span>
              </div>
              <span className="font-bold">{equipo.puntos ?? 0} pts</span>
            </li>
          ))}
           <li className="pt-2">
             <Link to="/tabla" className="text-blue-600 hover:text-blue-800 text-xs font-semibold flex items-center justify-end">
               Ver Tabla Completa <ArrowRightIcon className="h-3 w-3 ml-1" />
             </Link>
           </li>
        </ul>
      ) : (
        <p className="text-sm text-gray-500 italic">No hay datos de clasificación disponibles.</p>
      )}
    </WidgetCard>
  );
};

// --- Widget: Líderes Individuales (Goleadores) ---
const GoleadoresWidget = ({ jugadores }) => {
  const [topGoleadores, setTopGoleadores] = useState([]);

  useEffect(() => {
    if (jugadores) {
      const sorted = [...jugadores]
        .filter(j => (j.goles ?? 0) > 0) // Filtrar jugadores con goles
        .sort((a, b) => (b.goles ?? 0) - (a.goles ?? 0));
      setTopGoleadores(sorted.slice(0, 5)); // Top 5 goleadores
    }
  }, [jugadores]);

  const renderFoto = (jugador) => {
    if (!jugador || !jugador.foto_jug ) return <div className="h-8 w-8 bg-gray-300 rounded-full"></div>;
    return (
        <img
            className="h-8 w-8 object-cover rounded-full"
            src={`${BACKEND_ORIGIN}/uploads/jugadores/${jugador.foto_jug}`}
            alt={`${jugador.nombre} ${jugador.apellido}`}
            onError={(e) => e.target.style.display = 'none'}
        />
    );
  };
   const renderInsigniaEquipo = (equipo) => {
    if (!equipo || !equipo.foto_equipo) return null;
    return (
        <img
            className="h-4 w-4 object-contain inline-block ml-1 rounded-full"
            src={`${BACKEND_ORIGIN}/uploads/equipos/${equipo.foto_equipo}`}
            alt={equipo.nombre}
            title={equipo.nombre} // Tooltip con nombre de equipo
            onError={(e) => e.target.style.display = 'none'}
        />
    );
  };

  return (
    <WidgetCard title="Máximos Goleadores" icon={<StarIcon />}>
      {topGoleadores.length > 0 ? (
        <ul className="space-y-3">
          {topGoleadores.map((jugador) => (
            <li key={jugador._id} className="flex justify-between items-center text-sm">
              <div className="flex items-center space-x-2">
                {renderFoto(jugador)}
                <div>
                  <span className="font-medium">{jugador.nombre} {jugador.apellido}</span>
                  {jugador.equip && renderInsigniaEquipo(jugador.equip)}
                </div>
              </div>
              <span className="font-bold text-lg">{jugador.goles ?? 0}</span>
            </li>
          ))}
           <li className="pt-2">
             <Link to="/estadisticas" className="text-blue-600 hover:text-blue-800 text-xs font-semibold flex items-center justify-end">
               Ver Estadísticas Completas <ArrowRightIcon className="h-3 w-3 ml-1" />
             </Link>
           </li>
        </ul>
      ) : (
        <p className="text-sm text-gray-500 italic">No hay goleadores registrados.</p>
      )}
    </WidgetCard>
  );
};

// --- Widget: Últimas Noticias ---
const NoticiasWidget = ({ noticias }) => {
  const ultimasNoticias = noticias?.slice(0, 3) || []; // Tomar las 3 más recientes

  return (
    <WidgetCard title="Últimas Noticias" icon={<NewspaperIcon />}>
      {ultimasNoticias.length > 0 ? (
        <ul className="space-y-2">
          {ultimasNoticias.map((noti) => (
            <li key={noti._id} className="text-sm hover:bg-gray-50 p-1 rounded">
              <Link to={`/noticias/${noti._id}`} className="text-blue-600 hover:text-blue-800 font-medium block truncate" title={noti.tittle}>
                {noti.tittle}
              </Link>
              {/* Opcional: Mostrar fecha o descripción corta */}
              {/* <p className="text-xs text-gray-500 truncate">{noti.description}</p> */}
            </li>
          ))}
          <li className="pt-2 flex justify-between items-center">
             <Link to="/admin/noticias" className="text-blue-600 hover:text-blue-800 text-xs font-semibold flex items-center">
               Gestionar Noticias <ArrowRightIcon className="h-3 w-3 ml-1" />
             </Link>
             <Link to="/admin/noticias/new" className="bg-green-500 hover:bg-green-600 text-white text-xs font-semibold py-1 px-2 rounded">
               Crear Noticia
             </Link>
           </li>
        </ul>
      ) : (
        <p className="text-sm text-gray-500 italic">No hay noticias publicadas.</p>
      )}
    </WidgetCard>
  );
};

// --- Widget: Equipo Más Goleador ---
const EquipoMasGoleadorWidget = ({ equipos }) => {
  const [equipoTop, setEquipoTop] = useState(null);

  useEffect(() => {
    if (equipos && equipos.length > 0) {
      const sorted = [...equipos].sort((a, b) => (b.goles_a_favor ?? 0) - (a.goles_a_favor ?? 0));
      setEquipoTop(sorted[0]);
    }
  }, [equipos]);

   const renderInsignia = (equipo) => {
    if (!equipo || !equipo.foto_equipo) return <div className="h-10 w-10 bg-gray-300 rounded-full"></div>;
    return (
        <img
            className="h-10 w-10 object-contain rounded-full"
            src={`${BACKEND_ORIGIN}/uploads/equipos/${equipo.foto_equipo}`}
            alt={equipo.nombre}
            onError={(e) => e.target.style.display = 'none'}
        />
    );
  };

  return (
    <WidgetCard title="Equipo Más Goleador" icon={<ChartBarIcon />}>
      {equipoTop ? (
        <div className="flex items-center space-x-3">
           {renderInsignia(equipoTop)}
           <div>
             <p className="font-semibold">{equipoTop.nombre}</p>
             <p className="text-2xl font-bold text-blue-600">{equipoTop.goles_a_favor ?? 0} <span className="text-sm font-normal text-gray-500">goles</span></p>
           </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic">No hay datos de equipos.</p>
      )}
    </WidgetCard>
  );
};

// --- Widget: Accesos Rápidos ---
const AccesosRapidosWidget = () => (
  <WidgetCard title="Accesos Rápidos" icon={<ShieldCheckIcon />} className="col-span-1 md:col-span-2 lg:col-span-1">
    <div className="grid grid-cols-2 gap-3">
      <Link to="/admin/jugadores" className="block p-3 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg text-center font-medium text-sm transition duration-200">
        <UsersIcon className="h-6 w-6 mx-auto mb-1" /> Jugadores
      </Link>
      <Link to="/admin/equipos" className="block p-3 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg text-center font-medium text-sm transition duration-200">
        <ShieldCheckIcon className="h-6 w-6 mx-auto mb-1" /> Equipos
      </Link>
      <Link to="/admin/calendario" className="block p-3 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 rounded-lg text-center font-medium text-sm transition duration-200">
        <CalendarIcon className="h-6 w-6 mx-auto mb-1" /> Calendario
      </Link>
       <Link to="/admin/goles" className="block p-3 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-lg text-center font-medium text-sm transition duration-200">
        <StarIcon className="h-6 w-6 mx-auto mb-1" /> Sumar Goles
      </Link>
    </div>
  </WidgetCard>
);


// --- Componente Principal del Dashboard ---
function DashboardPage() {
  const { equipos, getEquipos } = useEquipos();
  const { juga, getJugadores } = useJugador(); // Cambiado de 'jugadores' a 'juga' según tu contexto
  const { notis, getNotis } = useNotis();
  const { calendario, getCalendario } = useCalen(); // Cambiado de 'partidos' a 'calendario' según tu contexto
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Llama a todas las funciones de carga en paralelo
        await Promise.all([
          getEquipos(),
          getJugadores(),
          getNotis(),
          getCalendario()
        ]);
      } catch (error) {
        console.error("Error cargando datos del dashboard:", error);
        // Aquí podrías mostrar un mensaje de error general
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Ejecutar solo una vez al montar

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold text-gray-600">Cargando Dashboard...</p>
        {/* Aquí podrías poner un spinner más elaborado */}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 bg-gray-100 min-h-screen"> {/* Fondo gris claro */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Centro de Mando</h1>

      {/* Grid para los widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Renderiza los widgets pasando los datos correspondientes */}
        <ProximaJornadaWidget partidos={calendario} />
        <ClasificacionWidget equipos={equipos} />
        <GoleadoresWidget jugadores={juga} />
        <NoticiasWidget noticias={notis} />
        <EquipoMasGoleadorWidget equipos={equipos} />
        <AccesosRapidosWidget />

        {/* Puedes añadir más widgets aquí si es necesario */}
        {/* <WidgetCard title="Estado Liga (Placeholder)" icon={<span>🚦</span>}>
            <p className="text-sm text-green-600 font-semibold">Temporada Activa</p>
            <p className="text-xs text-gray-500">Jornada 5 en curso</p>
        </WidgetCard> */}

      </div>
    </div>
  );
}

export default DashboardPage;
