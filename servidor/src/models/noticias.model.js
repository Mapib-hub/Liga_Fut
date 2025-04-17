import mongoose, { Mongoose } from "mongoose";

const notiSchema = new mongoose.Schema({
    tiulo:{
        type: String,
        required: true,
    },
    descripcion:{
        type: String,
        required: true,
    },
    
    img_portada:{
        type: String,
        default: "perfil.jpg",
    },
    date:{
        type: Date,
        default: Date.now,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
},{
    timestamps:true
});

export default mongoose.model("Noti", notiSchema);