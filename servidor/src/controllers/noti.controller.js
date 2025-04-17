import Noti from "../models/noticia.model.js";

export const getNotis = async (req, res) => {
    try {
        const notis = await Noti.find()//{user: req.user.id}
        .sort({ createdAt: -1 }) // Ordena de más nuevas a más antiguas
        .populate('user');
        
        res.json(notis);
    } catch (error) {
        console.log(error);
        //return res.status(500).json({ message: "Algo salio Mal" });
    }
};

export const createNoti = async (req, res) => {
    //console.log(req.body)
    try {
        const { tittle, description } = req.body;
        const newNoti = new Noti({
            tittle,
            description,
            foto_noti: req.file ? req.file.filename : "noti_01.jpg",
            user: req.user.id,
        });
        const saveNoti = await newNoti.save();
        res.json(saveNoti);
    } catch (error) {
        //console.log(error)
        return res.status(500).json({ message: "Algo salio Mal" });
    }
};
export const getNoti = async (req, res) => {
    try {
        const noti = await Noti.findById(req.params.id);
        if (!noti) return res.status(404).json({ message: "Noticia no encontrado" });
        res.json(noti);
        //console.log(task);
    } catch (error) {
        return res.status(404).json({ message: "Noticia no encontrado" });
    }
};

export const updateNoti = async (req, res) => {
    
   try {
       const { id } = req.params;
       const { tittle, description } = req.body;
       // Crear un objeto para los campos que se van a actualizar
       let updatedFields = {};
   
       // Solo agregar campos que estén presentes en la solicitud
       if (tittle !== undefined) updatedFields.tittle = tittle;
       if (description !== undefined) updatedFields.description = description;
        // Actualizar goles solo si está presente
   
       // Verificar si se subió una nueva imagen
       if (req.file) {
         updatedFields.foto_noti = req.file.filename;
       }
       // Actualizar el jugador con los campos especificados
       const updatedNoti = await Noti.findByIdAndUpdate(id, updatedFields, {
         new: true,
       });
   
       if (!updatedNoti)
         return res.status(404).json({ message: "Jugador no encontrado" });
   
       res.json(updatedNoti);
     } catch (error) {
       res.status(500).json({ message: error.message });
     }
};

export const deleteNoti = async (req, res ) =>{
    try {
        const noti = await Noti.findByIdAndDelete(req.params.id);
    if(!noti) return res.status(404).json({message: "Notici no encontrada"});
    return res.sendStatus(204);
    } catch (error) {
        ///console.log(error);
        return res.status(404).json({message: "Notici no encontrada"});
    }
};