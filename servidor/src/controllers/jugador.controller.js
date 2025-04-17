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
  /*console.log(req.params);
  console.log(req.body);*/
  try {
    const { id } = req.params;
    const { goles } = req.body;
    const noti = await Juga.findById(req.params.id);
    const golesObt  = parseFloat(noti.goles) + parseFloat(goles);
    const jugaActualizada = await Juga.findByIdAndUpdate(
      id,
     { goles: golesObt },
       { new: true }
    );
   // console.log(golesObt)
      if (!jugaActualizada) return res.status(404).json({ message: "Jugador no encontrada" });
      res.status(200).json(jugaActualizada);
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar los goles", error });
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