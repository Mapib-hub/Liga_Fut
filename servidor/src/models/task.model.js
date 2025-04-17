import mongoose, { Mongoose } from "mongoose";

const taskSchema = new mongoose.Schema({
    tittle:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    
    img:{
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

export default mongoose.model("Task", taskSchema);