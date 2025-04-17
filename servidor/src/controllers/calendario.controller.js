import Partido from "../models/partido.model.js";
import Equipo from "../models/equipos.model.js";

export const generarCalendario = async (req, res) => {
  try {
    const equipos = await Equipo.find();

    if (equipos.length < 2) {
      return res.status(400).json({ message: "Se necesitan al menos dos equipos para generar un calendario." });
    }

    const cantidadEquipos = equipos.length;
    const totalJornadas = cantidadEquipos - 1;
    const partidosPorJornada = Math.floor(cantidadEquipos / 2);
    const equiposRotables = equipos.slice(1);
    const calendario = [];

    for (let jornada = 0; jornada < totalJornadas; jornada++) {
      const jornadaActual = [];
      for (let partido = 0; partido < partidosPorJornada; partido++) {
        const local = partido === 0 ? equipos[0] : equiposRotables[partido - 1];
        const visitante = equiposRotables[partidosPorJornada - partido - 1];

        jornadaActual.push({
          equipo_local: local._id,
          equipo_visitante: visitante._id,
          marcador_local: null,
          marcador_visitante: null,
          lugar: "Estadio Neutral", // Lugar predeterminado
          //fecha: new Date(Date.now() + jornada * 7 * 24 * 60 * 60 * 1000), // Fecha simulada, cada jornada una semana después
          estado: "pendiente", // Estado en minúsculas para cumplir con el enum
        });
      }

      equiposRotables.unshift(equiposRotables.pop());
      calendario.push(jornadaActual);
    }

    const partidosGuardados = [];
    for (const jornada of calendario) {
      for (const partido of jornada) {
        const nuevoPartido = new Partido(partido);
        await nuevoPartido.save();
        partidosGuardados.push(nuevoPartido);
      }
    }

    res.status(201).json({
      message: "Calendario generado exitosamente.",
      partidos: partidosGuardados,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al generar el calendario.", error });
  }
};

