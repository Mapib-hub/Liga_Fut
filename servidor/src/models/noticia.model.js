import mongoose from "mongoose";

const noticiaSchema = new mongoose.Schema({
    tittle:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    foto_noti:{
        type: String,
        default: "noticia.jpg",
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
},{
    timestamps: true,
})

export default mongoose.model('Noti', noticiaSchema)