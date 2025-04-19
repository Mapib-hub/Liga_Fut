import Equip from "../models/equipos.model.js";
import path from 'path';                     // <--- AÑADE ESTA LÍNEA
import fs from 'fs-extra';                 // <--- AÑADE ESTA LÍNEA (o 'fs/promises')
import { fileURLToPath } from 'url';         // <--- AÑADE ESTA SI USAS __dirname con ES Modules

// --- Necesario para obtener __dirname en ES Modules ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const getEquipos = async (req, res) => {
  try {
    const equip = await Equip.find();
    res.json(equip);
  } catch (error) {
    console.log(error);
  }
};

export const createEquip = async (req, res) => {
  try {
      // Obtiene los campos de texto del body
      const { nombre, description, fundado, estadio } = req.body;

      // Obtiene el nombre del archivo subido por Multer, si existe
      // Si no se subió archivo, puedes poner un valor por defecto o null
      const foto_equipo = req.file ? req.file.filename : 'equipo.jpg'; // O null si prefieres

      // Verifica si el usuario está autenticado (si es necesario)
      if (!req.user || !req.user.id) {
         // Si se subió un archivo pero el usuario no está autenticado, bórralo
         if (req.file) {
            try { await fs.unlink(req.file.path); } catch (e) { console.error("Error borrando archivo huérfano:", e); }
         }
         return res.status(401).json({ message: "No autorizado" });
      }

      const newEqui = new Equip({
          nombre,
          description,
          foto_equipo: foto_equipo, // Usa el filename de Multer o el default
          fundado,
          estadio,
          user: req.user.id, // Asegúrate que req.user.id viene de tu middleware authRequire
      });

      const saveEqui = await newEqui.save();
      res.status(201).json(saveEqui); // Es bueno usar 201 para creación exitosa

  } catch (error) {
      // Si hubo un error al guardar en DB y se subió un archivo, intenta borrarlo
      if (req.file) {
         try { await fs.unlink(req.file.path); } catch (e) { console.error("Error borrando archivo tras error de guardado:", e); }
      }
      console.error("Error al crear equipo:", error); // Loguea el error real
      return res.status(500).json({ message: "Algo salió mal al crear el equipo" });
  }
};

// ... (resto de funciones) ...

export const getEqui = async (req, res) => {
    try {
        const noti = await Equip.findById(req.params.id).populate("jugadores");
        if (!noti) return res.status(404).json({ message: "Equipo no encontrado" });
        res.json(noti);
        //console.log(task);
    } catch (error) {
        return res.status(404).json({ message: "Equipo no encontrado" });
    }
};

export const updateEquip = async (req, res) => {
    const { id } = req.params;
    const { nombre, description, estadio, fundado } = req.body;
  
    try {
      const equipoToUpdate = await Equip.findById(id);
  
      if (!equipoToUpdate) {
        // Si se subió un archivo pero el equipo no existe, borrar el archivo subido
        if (req.file) {
           await fs.unlink(req.file.path);
        }
        return res.status(404).json({ message: "Equipo no encontrado" });
      }
  
      // Datos a actualizar (excluyendo la foto por ahora)
      const updateData = {
        nombre,
        description,
        estadio,
        fundado: fundado ? new Date(fundado) : equipoToUpdate.fundado, // Mantener la fecha si no se envía nueva
      };
  
      // Manejar la actualización de la foto si se subió una nueva
      if (req.file) {
        // Si había una foto anterior (y no es la default), borrarla del servidor
        if (equipoToUpdate.foto_equipo && equipoToUpdate.foto_equipo !== 'equipo.jpg') {
            const oldImagePath = path.resolve(
                __dirname,                     // Directorio actual (servidor/src/controllers)
                '../uploads/equipos',          // Sube un nivel y entra a uploads/equipos
                equipoToUpdate.foto_equipo     // Nombre del archivo
            );
            console.log("Intentando borrar imagen antigua:", oldImagePath); // Mantenemos el log para depurar
            try {
                await fs.unlink(oldImagePath);
                console.log("Imagen antigua borrada con éxito.");
            } catch (err) {
                console.warn("Advertencia: No se pudo borrar la imagen antigua (puede que no exista):", err.message);
            }
        }
        // Actualizar con el nombre del nuevo archivo subido por multer
        updateData.foto_equipo = req.file.filename;
      }
  
      const equipoActualizado = await Equip.findByIdAndUpdate(
        id,
        { $set: updateData }, // Usar $set para actualizar solo los campos proporcionados
        { new: true } // Para que devuelva el documento actualizado
      );
  
      res.json(equipoActualizado);
  
    } catch (error) {
       // Si hubo un error en la actualización y se subió un archivo, borrarlo
       if (req.file) {
          try {
             await fs.unlink(req.file.path);
          } catch (unlinkErr) {
             console.error("Error borrando archivo subido tras error de actualización:", unlinkErr);
          }
       }
       console.error("Error al actualizar equipo:", error);
       res.status(500).json({ message: "Error interno del servidor al actualizar el equipo" });
    }
  };

export const deleteEquip = async (req, res ) =>{
    try {
        const noti = await Equip.findByIdAndDelete(req.params.id);
    if(!noti) return res.status(404).json({message: "Equipo no encontrado"});
    return res.sendStatus(204);
    } catch (error) {
        ///console.log(error);
        return res.status(404).json({message: "Equipo no encontrado"});
    }
};
