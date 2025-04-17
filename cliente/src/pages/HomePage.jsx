import { useEffect } from "react";
import { useTasks } from "../context/TasksContext";
import TaskCard from "../components/TaskCard";
import TablaTask from "../components/TablaTask.jsx";

function HomePage(){
    
        const{getTareas, tasks} = useTasks();
    
        useEffect(() =>{
            getTareas()
        }, []);
    
        if (tasks.length == 0) return (<h1>No hay  Tareas</h1>);
    
    
        return (
            <div className="min-w-lg grid gap-4 row-span-3">
            <table className="min-w-full text-left text-sm font-light">
                <thead className="border-b font-medium dark:border-neutral-500">
                    <tr>
                    <th>Titulo</th>
                    <th>Descripcion</th>
                    <th>Imagen </th>
                    <th></th>
                    </tr>
                </thead>
                <tbody>
                {tasks.map((task) =>(
                // <TaskCard task = {task} key={task._id} />  
                    <TablaTask task = {task} key={task._id} />
                ))}
                </tbody>
            
            </table>
            </div>
        );
    
}

export default HomePage;