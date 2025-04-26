import Equip from "../models/equipos.model.js";
import Juga from "../models/jugador.model.js";
import Noti from "../models/noticia.model.js";
import Fecha from "../models/fecha.model.js";
import Partido from "../models/partido.model.js";
import Alert from "../models/alert.model.js";

// Obtener noticias carrusel
export const getCarrusel = async (req, res) => {
  try {
    const notis = await Noti.find()
      .select("tittle foto_noti description")
      .sort({ createdAt: -1 }) // Ordenar por los más nuevos primero
      .limit(3); // Limitar a 3 resultados
    res.json(notis); // Devolver los resultados correctos
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener todos los equipos
export const getEquipos = async (req, res) => {
  try {
    const equipos = await Equip.find()
    .select("nombre description foto_equipo estadio fundado puntos partidos_jugados victorias empates derrotas goles_a_favor goles_en_contra diferencia_de_goles puntos ");
    //.populate("jugadores", "nombre apellido posicion");
    res.json(equipos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Obtener un equipo por ID
export const getEquipoById = async (req, res) => {
  try {
    //console.log(req.params.id);
    const equipo = await Equip.findById(req.params.id)
      .populate("jugadores", "nombre apellido posicion goles") // Relaciona jugadores (si usas el virtual)
      .select(
        "nombre description foto_equipo estadio fundado puntos partidos_jugados victorias empates derrotas goles_a_favor goles_en_contra diferencia_de_goles puntos"
      );
    if (!equipo)
      return res.status(404).json({ message: "Equipo no encontrado" });
    res.json(equipo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getEquipo_jug = async (req, res) => {
  try {
    const equipo = await Equip.findById(req.params.id)
      .populate("jugadores", "nombre apellido posicion") // Relaciona jugadores (si usas el virtual)
      .select("nombre estadio fundado jugadores");
    if (!equipo)
      return res.status(404).json({ message: "Equipo no encontrado" });
    res.json(equipo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getNotis3 = async (req, res) => {
  try {
    const notis = await Noti.find()
      .select("tittle foto_noti description")
      .sort({ createdAt: -1 })
      .skip(3); // Saltar las primeras 3 noticias
    res.json(notis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getNotis = async (req, res) => {
  try {
    const notis = await Noti.find()
      .sort({ createdAt: -1 }) // Ordena de más nuevas a más antiguas
      .populate({
        path: 'user',
        select: 'username', // Selecciona solo el campo 'username' del usuario
      })
      .select('tittle foto_noti description createdAt'); // Selecciona los campos de la noticia
    res.json(notis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getNotisById = async (req, res) => {
  try {
    const notis = await Noti.findById(req.params.id)
    .populate({
      path: 'user',
      select: 'username', // Selecciona solo el campo 'username' del usuario
    })
    .select(
      "tittle foto_noti description createdAt"
    );
    res.json(notis);
    //console.log(notis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Obtener todos los jugadores
export const getJugadores = async (req, res) => {
  try {
    // --- NUEVO: Manejo de Query Params ---
    const { sort, limit, offset, goles_min, search } = req.query;

    // 1. Construir filtro base
    let filter = {};
    // Filtrar por goles mínimos si se especifica (convertir a número)
    const minGoles = parseInt(goles_min);
    if (!isNaN(minGoles) && minGoles > 0) {
      filter.goles = { $gte: minGoles }; // $gte = greater than or equal
    }

    // Filtrar por búsqueda (nombre o apellido, case-insensitive)
    if (search && typeof search === 'string' && search.trim() !== '') {
        const regex = new RegExp(search.trim(), 'i'); // 'i' para case-insensitive
        filter.$or = [ // Buscar en nombre O apellido
            { nombre: regex },
            { apellido: regex }
        ];
    }

    // 2. Construir opciones de ordenamiento
    let sortOptions = {};
    if (sort === 'goles:desc') {
      sortOptions = { goles: -1 }; // -1 para descendente
    }
    // --- NUEVO: Añadir ordenamiento por tarjetas (si se pide) ---
    else if (sort === 'tarjetas_amarillas:desc') {
        sortOptions = { tarjetas_amarillas: -1 };
    }
    else if (sort === 'tarjetas_rojas:desc') {
        sortOptions = { tarjetas_rojas: -1 };
    }
    // --- FIN NUEVO ---
    // Default sort si no se especifica (podría ser por apellido)
    else {
        sortOptions = { apellido: 1 }; // 1 para ascendente
    }


    // 3. Construir opciones de paginación (convertir a números)
    const limitNum = parseInt(limit) || 20; // Default a 20 si no se especifica o es inválido
    const offsetNum = parseInt(offset) || 0; // Default a 0

    // 4. Contar total de documentos que coinciden con el filtro (ANTES de paginar)
    const totalJugadores = await Juga.countDocuments(filter);

    // 5. Ejecutar la consulta con filtro, ordenamiento y paginación
    const jugadores = await Juga.find(filter)
      .sort(sortOptions)
      .limit(limitNum)
      .skip(offsetNum)
      .populate("equip", "nombre foto_equipo") // Trae solo el nombre y foto del equipo
      .select( // Selecciona los campos necesarios
        "nombre apellido foto_jug posicion goles tarjetas_amarillas tarjetas_rojas"
      );
    // --- FIN MODIFICACIONES ---

    // Devolver los jugadores y el total (para que el frontend sepa si hay más páginas)
    res.json({ jugadores, totalJugadores }); // <-- Devolvemos un objeto

  } catch (error) {
    console.error("Error en getJugadores:", error); // Mejor loguear el error
    res.status(500).json({ message: error.message });
  }
};
export const getGoleadores = async (req, res) => {
  try {
    const jugadores = await Juga.find()
      .populate("equip", "nombre foto_equipo") // Trae solo el nombre del equipo asociado
      .select(
        "nombre apellido foto_jug posicion goles tarjetas_amarillas tarjetas_rojas"
      );
    res.json(jugadores);
    //console.log(jugadores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getJugadoresById = async (req, res) => {
  try {
    const equipo = await Juga.findById(req.params.id)
      .populate("equip", "nombre foto_equipo") // Trae solo el nombre del equipo asociado
      .select(
        "nombre foto_jug apellido posicion goles tarjetas_amarillas tarjetas_rojas fecha_nac"
      );
    res.json(equipo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const obtenerFechayPartido = async (req, res) => {
  try {
    const fechas = await Fecha.find()
      .populate({
        path: "partidos",
        populate: [
          {
            path: "equipo_local",
            model: "Equip",
            select: "nombre estadio foto_equipo",
          },
          {
            path: "equipo_visitante",
            model: "Equip",
            select: "nombre foto_equipo",
          },
        ],
      });
     /// console.log(fechas);
    res.status(200).json(fechas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las fechas", error });
  }
};
export const obtenerFecha = async (req, res) => {
  try {
    const { id } = req.params;
    const fecha = await Fecha.findById(id)
    .populate({
      path: "partidos",
      populate: {
        path: "equipo_local equipo_visitante",
        model: "Equip",
      },
    });
    if (!fecha) return res.status(404).json({ message: "Fecha no encontrada" });
    res.status(200).json(fecha);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la fecha", error });
  }
};
export const obtenerPartidos = async (req, res) => {
  try {
    const partidos = await Partido.find()
      .populate("equipo_local", "nombre foto_equipo") // Solo trae el campo "nombre" del equipo local
      .populate("equipo_visitante", "nombre foto_equipo") // Solo trae el campo "nombre" del equipo visitante
      .populate("fecha", "nombre fecha");
    res.status(200).json(partidos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los partidos", error });
  }
};
export const obtenerPartido = async (req, res) => {
  try {
    const { id } = req.params;
    const partido = await Partido.findById(id).populate(
      "equipo_local equipo_visitante",
      "nombre"
    );
    /*.populate("fecha", "nombre fecha")*/ //console.log(partido);
    if (!partido)
      return res.status(404).json({ message: "Partido no encontrado" });
    res.status(200).json(partido);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el partido", error });
  }
};
export const obtenerFechas = async (req, res) => {
  try {
    const fechas = await Fecha.find().populate("partidos");
    res.status(200).json(fechas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las fechas", error });
  }
};
export const getAlert = async (req, res) => {
  try {
    const alertStatus = await Alert.findOne({ singleton: 'global_alert_config' }); // Busca por el singleton

    if (alertStatus) {
      res.json({
        isActive: alertStatus.isActive,
        message: alertStatus.message,
        type: alertStatus.type,
      });
    } else {
      res.json({ isActive: false }); // Inactiva por defecto si no existe
    }
  } catch (error) {
    console.error("Error al obtener el estado de la alerta:", error);
    res.status(500).json({ message: "Error interno del servidor al obtener la alerta." });
  }
};

/**
 * Actualiza (o crea si no existe) la configuración global de la alerta.
 * Utiliza el campo 'singleton' para asegurar que solo haya un documento.
 * (Usado por la ruta protegida PUT /admin/alert)
 */
export const updateAlert = async (req, res) => {
  try {
    const { isActive, message, type } = req.body;

    const updateData = {
      isActive,
      message: isActive ? message : '',
      type: isActive ? type : 'info',
      singleton: 'global_alert_config' // Importante para upsert
    };
  
    const updatedAlert = await Alert.findOneAndUpdate(
      { singleton: 'global_alert_config' }, // Filtro
      updateData,                           // Datos
      { new: true, upsert: true, runValidators: true } // Opciones
    );

    res.json(updatedAlert); // Devuelve el estado actualizado

  } catch (error) {
    console.error("Error al actualizar la configuración de alerta:", error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: `Error de validación: ${error.message}` });
    }
    res.status(500).json({ message: "Error interno del servidor al actualizar la alerta." });
  }
};
