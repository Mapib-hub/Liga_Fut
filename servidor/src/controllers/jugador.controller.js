import Juga from "../models/jugador.model.js";

export const getJugadores = async (req, res) => {
  try {
    
    const juga = await Juga.find().populate("equip");
    res.json(juga);
  } catch (error) {
    console.log(error);
  }
}; 
export const createMultipleJugadores = async (req, res) => {
  
  try {
    //console.log(req.user.id);
    const { jugadores } = req.body; // `jugadores` será un array de objetos con los datos de los jugadores

    if (!Array.isArray(jugadores) || jugadores.length === 0) {
      return res.status(400).json({ message: "Debe proporcionar un array de jugadores." });
    }

    // Recorremos el array y asignamos valores predeterminados si es necesario
    const jugadoresProcesados = jugadores.map(jugador => ({
      nombre: jugador.nombre,
      apellido: jugador.apellido || "",
      email: jugador.email || "",
      equip: jugador.equip, // Relacionado al equipo por su ID
      posicion: jugador.posicion || "Sin posición",
      fecha_nac: jugador.fecha_nac || "2000-01-01",
      user: req.user.id, // Opcional según la autenticación
      foto_jug: jugador.foto_jug || "player.jpg", // Valor por defecto para la foto
    }));

    // Insertamos todos los jugadores
    const savedJugadores = await Juga.insertMany(jugadoresProcesados);
    res.status(201).json(savedJugadores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear jugadores", error: error.message });
  }
};

export const createJugador = async (req, res) => {
  try {
    const { nombre, apellido, email, equip, posicion, fecha_nac } = req.body;

    const newJugador = new Juga({
      nombre,
      apellido,
      email,
      equip,
      posicion,
      fecha_nac, 
      user: req.user.id,
      foto_jug: req.file ? req.file.filename : "player.jpg", // Usa el nombre del archivo subido o el valor por defecto
    });

    const savedJugador = await newJugador.save();
    res.json(savedJugador);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getJugador = async (req, res) => {
    try {
        const noti = await Juga.findById(req.params.id);
        if (!noti) return res.status(404).json({ message: "Noticia no encontrado" });
        res.json(noti);
        //console.log(task);
    } catch (error) {
        return res.status(404).json({ message: "Noticia no encontrado" });
    }
};

export const updateJugador = async (req, res) => {
  
  try {
    const { id } = req.params;
    const { nombre, apellido, email, equip, posicion, fecha_nac, goles } = req.body;
    // Crear un objeto para los campos que se van a actualizar
    let updatedFields = {};

    // Solo agregar campos que estén presentes en la solicitud
    if (nombre !== undefined) updatedFields.nombre = nombre;
    if (apellido !== undefined) updatedFields.apellido = apellido;
    if (email !== undefined) updatedFields.email = email;
    if (equip !== undefined) updatedFields.equip = equip;
    if (posicion !== undefined) updatedFields.posicion = posicion;
    if (fecha_nac !== undefined) updatedFields.fecha_nac = fecha_nac;
    if (goles !== undefined) updatedFields.goles = goles; // Actualizar goles solo si está presente

    // Verificar si se subió una nueva imagen
    if (req.file) {
      updatedFields.foto_jug = req.file.filename;
    }
    // Actualizar el jugador con los campos especificados
    const updatedJugador = await Juga.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    if (!updatedJugador)
      return res.status(404).json({ message: "Jugador no encontrado" });

    res.json(updatedJugador);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateGoles = async (req, res) => {
  console.log("Params:", req.params.id); // Mantenemos logs
  console.log("Body:", req.body);       // Mantenemos logs

  try {
    const { id } = req.params;

    // --- CORRECCIÓN: Acceder al valor anidado ---
    // Extraer el número 'goles' del objeto interno 'goles'
    const golesASumar = req.body.goles?.goles; // Usamos optional chaining por seguridad
    // --- FIN CORRECCIÓN ---

    // --- VALIDACIÓN MEJORADA ---
    if (golesASumar === undefined || golesASumar === null || typeof golesASumar !== 'number') {
      return res.status(400).json({ message: "El valor de 'goles' a sumar es inválido o no se proporcionó correctamente en el formato esperado." });
    }
    if (!Number.isInteger(golesASumar) || golesASumar < 0) {
       // Permitimos sumar 0, pero no negativos para "Sumar Goles"
       return res.status(400).json({ message: "Los goles a sumar deben ser un número entero no negativo." });
    }
    // --- FIN VALIDACIÓN ---

    const jugadorActual = await Juga.findById(id); // Buscar jugador actual
    if (!jugadorActual) {
      return res.status(404).json({ message: "Jugador no encontrado" });
    }

    // Asegurar que los goles actuales sean un número (o 0 si no existen/son inválidos)
    const golesActuales = Number.isFinite(jugadorActual.goles) ? jugadorActual.goles : 0;

    // Calcular la suma (ya no necesitamos parseFloat si validamos como número)
    const golesObt = golesActuales + golesASumar;

    const jugaActualizada = await Juga.findByIdAndUpdate(
      id,
      { goles: golesObt },
      { new: true, runValidators: true } // Añadir runValidators es buena práctica
    );

    // findByIdAndUpdate devuelve null si no encuentra el ID, aunque ya lo validamos antes
    if (!jugaActualizada) {
         return res.status(404).json({ message: "Jugador no encontrado durante la actualización." });
    }

    console.log("Goles actualizados a:", jugaActualizada.goles); // Log del resultado
    res.status(200).json(jugaActualizada); // Devolver jugador actualizado

  } catch (error) {
    console.error("Error en updateGoles:", error); // Loguear el error completo
    // Manejo de errores específicos
    if (error.name === 'CastError') {
         return res.status(400).json({ message: "ID de jugador inválido." });
    }
    if (error.name === 'ValidationError') {
         // Si el schema tiene validaciones (ej: min: 0)
         return res.status(400).json({ message: `Error de validación: ${error.message}` });
    }
    // Error genérico
    res.status(500).json({ message: "Error interno del servidor al actualizar los goles." });
  }
};

export const deleteJugador = async (req, res ) =>{
    try {
        const noti = await Juga.findByIdAndDelete(req.params.id);
    if(!noti) return res.status(404).json({message: "Jugador no encontrado"});
    return res.sendStatus(204);
    } catch (error) {
        ///console.log(error);
        return res.status(404).json({message: "Jugador no encontrado"});
    }
};