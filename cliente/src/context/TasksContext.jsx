import { createContext, useContext, useState } from "react";
import {
    createTaskRequest,
    getTasksRequest,
    deleteTaskRequest,
    getTaskRequest,
    updateTaskRequest,
    getTareasRequest, // Asumo que esta es la que usa HomePage

    } from "../api/tasks.js";

const TaskContext = createContext();

export const useTasks = () => {
    const context = useContext(TaskContext);

    if (!context) {
        throw new Error("useTasks must be used within a TaskProvider");
    }
    return context;
}

export function TaskProvider( { children } ){
    const [tasks, setTasks] = useState([]); // Inicializa como array vacío

    // --- getTareas CORREGIDO ---
    const getTareas = async () => {
        try {
            console.log("Llamando a getTareasRequest..."); // Log para saber que se llama
            const res = await getTareasRequest();
            console.log("Respuesta de getTareasRequest:", res.data); // Log para ver la respuesta

            // Verifica si la respuesta es un array antes de actualizar el estado
            if (Array.isArray(res.data)) {
                setTasks(res.data);
            } else {
                console.error("API no devolvió un array en getTareas:", res.data);
                setTasks([]); // Establece un array vacío si la respuesta no es válida
            }
        } catch (error) {
           console.error("Error en getTareas:", error.response?.data || error.message || error);
           setTasks([]); // Establece un array vacío en caso de error en la petición
        }
    };

    // --- getTasks CORREGIDO ---
    const getTasks = async () => {
        try {
            console.log("Llamando a getTasksRequest..."); // Log
            const res = await getTasksRequest();
            console.log("Respuesta de getTasksRequest:", res.data); // Log

            // Verifica si la respuesta es un array
            if (Array.isArray(res.data)) {
                setTasks(res.data);
            } else {
                console.error("API no devolvió un array en getTasks:", res.data);
                setTasks([]); // Establece array vacío
            }
        } catch (error) {
           console.error("Error en getTasks:", error.response?.data || error.message || error);
           setTasks([]); // Establece array vacío en caso de error
        }
    };

    const createTask = async (task) =>{
       try {
            const res = await createTaskRequest(task);
            console.log("Tarea creada:", res);
            // Opcional: Podrías volver a llamar a getTareas() o getTasks() aquí
            // para refrescar la lista, o añadir la nueva tarea manualmente al estado.
            // Ejemplo añadiendo manualmente (si la API devuelve la tarea creada):
            // if (res.data) {
            //    setTasks(prevTasks => [...prevTasks, res.data]);
            // } else {
            //    getTareas(); // O simplemente recarga todo
            // }
       } catch (error) {
            console.error("Error creando tarea:", error.response?.data || error.message || error);
            // Aquí podrías manejar errores específicos de creación si es necesario
       }
    };

    const deleteTask = async (id) => {
        try {
            const res = await deleteTaskRequest(id);
            // El status 204 (No Content) es común para deletes exitosos
            if(res.status === 204) {
                // Filtra la tarea eliminada del estado actual
                setTasks(prevTasks => prevTasks.filter((task) => task._id !== id));
                console.log("Tarea eliminada:", id);
            } else {
                console.warn("Respuesta inesperada al eliminar tarea:", res);
            }
        } catch (error) {
            console.error("Error eliminando tarea:", error.response?.data || error.message || error);
        }
    };

    const getTask = async (id) =>{
        try {
            const res = await getTaskRequest(id);
            // Devuelve los datos de la tarea específica
            return res.data;
        } catch (error) {
            console.error("Error obteniendo tarea:", id, error.response?.data || error.message || error);
            // Podrías devolver null o lanzar el error para que el componente lo maneje
            return null;
        }
    };

    const updateTask = async (id, task) => {
        try {
            const res = await updateTaskRequest(id, task);
            console.log("Tarea actualizada:", res.data);
            // Actualiza el estado localmente para reflejar el cambio
            setTasks(prevTasks => prevTasks.map(t =>
                t._id === id ? { ...t, ...res.data } : t // Asume que res.data contiene la tarea actualizada
            ));
        } catch (error) {
            console.error("Error actualizando tarea:", id, error.response?.data || error.message || error);
        }
    }

    return(
        <TaskContext.Provider
        value={{
            tasks,
            createTask,
            getTasks, // Función general para obtener tareas (quizás para TasksPage)
            deleteTask,
            getTask,
            updateTask,
            getTareas, // Función específica (quizás para HomePage)
        }}>
            {children}
        </TaskContext.Provider>
    );
}
