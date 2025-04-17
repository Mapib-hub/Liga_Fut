import Fecha from "../models/fecha.model.js";

// Crear una nueva fecha
export const crearFecha = async (req, res) => {
  try {
    const { nombre, fecha } = req.body;
    const nuevaFecha = new Fecha({ nombre, fecha });
    await nuevaFecha.save();
    res.status(201).json(nuevaFecha);
  } catch (error) {
    res.status(500).json({ message: "Error al crear la fecha", error });
  }
};

// Obtener todas las fechas
export const obtenerFechas = async (req, res) => {
  try {
    const fechas = await Fecha.find();//.populate("partidos");
    res.status(200).json(fechas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las fechas", error });
  }
};

// Obtener una fecha específica
export const obtenerFecha = async (req, res) => {
  try {
    const { id } = req.params;
    const fecha = await Fecha.findById(id);//.populate("partidos");
    if (!fecha) return res.status(404).json({ message: "Fecha no encontrada" });
    res.status(200).json(fecha);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la fecha", error });
  }
};

// Actualizar una fecha
export const actualizarFecha = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, fecha } = req.body;
    const fechaActualizada = await Fecha.findByIdAndUpdate(
      id,
      { nombre, fecha },
      { new: true }
    );
    if (!fechaActualizada) return res.status(404).json({ message: "Fecha no encontrada" });
    res.status(200).json(fechaActualizada);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la fecha", error });
  }
};

// Eliminar una fecha
export const eliminarFecha = async (req, res) => {
  try {
    const { id } = req.params;
    const fechaEliminada = await Fecha.findByIdAndDelete(id);
    if (!fechaEliminada) return res.status(404).json({ message: "Fecha no encontrada" });
    res.status(200).json({ message: "Fecha eliminada con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la fecha", error });
  }
};
