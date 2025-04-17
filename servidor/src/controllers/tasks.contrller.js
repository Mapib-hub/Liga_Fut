import Task from "../models/task.model.js";

export const getTareas = async (req, res) => {
    try {
        const tasks = await Task.find()
        res.json(tasks);
        //console.log(tasks);
    } catch (error) {
        //console.log(error);
        return res.status(500).json({message: "Something went wrong"});  
    }
};

export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({
            user: req.user.id
        }).populate('user')
        res.json(tasks);
    } catch (error) {
        return res.status(500).json({message: "Something went wrong"});  
    }
};

export const createTask = async (req, res) => {
    try {
        const {tittle, description, date } = req.body;
        ///console.log(req.user);
        const newTask = new Task({
            tittle,
            description,
            date,
            user: req.user.id
        }) ;
        const savedTask = await newTask.save();
        res.json(savedTask);
    } catch (error) {
      return res.status(500).json({message: "Something went wrong"});  
    }
};

export const getTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if(!task) return res.status(404).json({ message: 'Task no encontrado'});
        res.json(task);
    } catch (error) {
        return  res.status(400).json({ message: "task not Found"});    
    }
};

export const updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new:true,
        });
        if(!task) return res.status(404).json({ message: 'Task no encontrado'});
        res.json(task);
    } catch (error) {
        return  res.status(400).json({ message: "task not Found"});
    }
};

export const deleteTask = async (req, res) => {
   try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if(!task) return res.status(404).json({ message: 'Task no encontrado'});
    return res.sendStatus(204);
   } catch (error) {
    return  res.status(400).json({ message: "task not Found"});
   }
};