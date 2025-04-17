// c:\Users\Acer\Desktop\proyectos\prueba_node\cliente\src\pages\admin\TasksPage.jsx
import { useEffect } from "react";
import { useTasks } from "../../context/TasksContext.jsx";
// import TaskCard from "../../components/TaskCard.jsx"; // No usado
import TablaTask from "../../components/TablaTask.jsx";

function TasksPage(){
    // Obtén deleteTask del contexto
    const { getTasks, tasks, deleteTask } = useTasks();

    useEffect(() =>{
        getTasks()
    }, []);

    // Mejor validación
    if (!tasks || tasks.length === 0) return (<h1>No hay Tareas</h1>);

    return (
        <div className="min-w-lg grid gap-4 row-span-3">
        <table className="min-w-full text-left text-sm font-light">
            <thead className="border-b font-medium dark:border-neutral-500">
                <tr>
                <th>Titulo</th>
                <th>Descripcion</th>
                <th>Imagen </th>
                <th>Acciones</th> {/* Cambiado th */}
                </tr>
            </thead>
            <tbody>
            {tasks.map((task) =>(
                 // Pasa la función deleteTask como prop onDelete
                <TablaTask
                    task={task}
                    key={task._id}
                    onDelete={deleteTask} // <-- Aquí está la magia
                />
            ))}
            </tbody>
        </table>
        </div>
    );
}

export default TasksPage;
