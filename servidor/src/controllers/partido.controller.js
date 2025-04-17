import Partido from "../models/partido.model.js";
import Fecha from "../models/fecha.model.js";
import Equip from "../models/equipos.model.js";

// Crear un nuevo partido
export const crearPartido = async (req, res) => {
  try {
    const { equipo_local, equipo_visitante, fecha, lugar } = req.body;
    //console.log(req.body);
    // Validar que los equipos no sean los mismos
    if (!equipo_local || !equipo_visitante) {
      return res.status(400).json({ message: "Los equipos son obligatorios" });
    }

    if (equipo_local === equipo_visitante) {
      return res
        .status(400)
        .json({ message: "Un equipo no puede jugar contra sí mismo" });
    }

    const nuevoPartido = new Partido({
      equipo_local,
      equipo_visitante,
      fecha,
      lugar,
    });

    const partidoGuardado = await nuevoPartido.save();

    // Asociar el partido a la fecha
   /* const fechaAsociada = await Fecha.findByIdAndUpdate(
      fecha,
      { $push: { partidos: partidoGuardado._id } },
      { new: true }
    );*/

    res.status(201).json({ partido: partidoGuardado /*, fecha: fechaAsociada*/});
  } catch (error) {
    res.status(500).json({ message: "Error al crear el partido", error });
  }
};

// Obtener todos los partidos
export const obtenerPartidos = async (req, res) => {
  try {
    const partidos = await Partido.find()
      .populate("equipo_local", "nombre estadio foto_equipo") // Solo trae el campo "nombre" del equipo local
      .populate("equipo_visitante", "nombre foto_equipo") // Solo trae el campo "nombre" del equipo visitante
      .populate("fecha", "nombre fecha");
    res.status(200).json(partidos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los partidos", error });
  }
};

// Obtener un partido específico
export const obtenerPartido = async (req, res) => {
  try {
    const { id } = req.params;
    const partido = await Partido.findById(id)
      .populate("equipo_local equipo_visitante", "nombre foto_equipo")
      /*.populate("fecha", "nombre fecha")*/;
    //console.log(partido);
    if (!partido)
      return res.status(404).json({ message: "Partido no encontrado" });
    res.status(200).json(partido);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el partido", error });
  }
};
// Actualizar Datos de un partido
export const actualizarPartido = async (req, res) => {
  //console.log(req.body);
  try {
    const noti = await Partido.findByIdAndUpdate(req.params.id, req.body, {
        new: true
      });
     // console.log(noti);
      if (!noti) return res.status(404).json({ message: "Task no encontrado" });
      res.json(noti);
    } catch (error) {
      return res.status(404).json({ message: "Task no encontrado" });
    }
};
// Actualizar un partido
export const actualizarGoles = async (req, res) => {
  //console.log(req.params.id, req.body);
  try {
    const noti = await Partido.findByIdAndUpdate(req.params.id, {
        ...req.body,
        estado: 'Finalizado'
      }, {
        new: true
      });
    ///console.log(noti);
    if (!noti) return res.status(404).json({ message: "Partido no encontrado" });

    // Actualiza los equipos asociados
    const equipoLocal = await Equip.findByIdAndUpdate(noti.equipo_local, {
      $inc: {
        partidos_jugados: 1,
        goles_a_favor: noti.marcador_local,
        goles_en_contra: noti.marcador_visitante,
        diferencia_de_goles: noti.marcador_local - noti.marcador_visitante,
        victorias: noti.estado === "Finalizado" && noti.marcador_local > noti.marcador_visitante ? 1 : 0,
        empates: noti.estado === "Finalizado" && noti.marcador_local === noti.marcador_visitante ? 1 : 0,
        derrotas: noti.estado === "Finalizado" && noti.marcador_local < noti.marcador_visitante ? 1 : 0,
        puntos: noti.estado === "Finalizado" && noti.marcador_local > noti.marcador_visitante ? 3 : noti.estado === "Finalizado" && noti.marcador_local === noti.marcador_visitante ? 1 : 0
      }
    }, { new: true });
    ///console.log(equipoLocal);

    const equipoVisitante = await Equip.findByIdAndUpdate(noti.equipo_visitante, {
      $inc: {
        partidos_jugados: 1,
        goles_a_favor: noti.marcador_visitante,
        goles_en_contra: noti.marcador_local,
        diferencia_de_goles: noti.marcador_visitante - noti.marcador_local,
        victorias: noti.estado === "Finalizado" && noti.marcador_visitante > noti.marcador_local ? 1 : 0,
        empates: noti.estado === "Finalizado" && noti.marcador_visitante === noti.marcador_local ? 1 : 0,
        derrotas: noti.estado === "Finalizado" && noti.marcador_visitante < noti.marcador_local ? 1 : 0,
        puntos: noti.estado === "Finalizado" && noti.marcador_visitante > noti.marcador_local ? 3 : noti.estado === "Finalizado" && noti.marcador_visitante === noti.marcador_local ? 1 : 0
      }
    }, { new: true });
    ///console.log(equipoVisitante);
    res.json({ message: "Partido actualizado correctamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al actualizar el partido" });
  }
};

// Eliminar un partido
export const eliminarPartido = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const partidoEliminado = await Partido.findByIdAndDelete(id);

    if (!partidoEliminado)
      return res.status(404).json({ message: "Partido no encontrado" });

    // Remover el partido de la fecha asociada
    await Fecha.findByIdAndUpdate(partidoEliminado.fecha, {
      $pull: { partidos: partidoEliminado._id },
    });

    res.status(200).json({ message: "Partido eliminado con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el partido", error });
  }
};
