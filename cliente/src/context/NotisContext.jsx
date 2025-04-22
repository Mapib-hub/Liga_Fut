import { createContext, useContext, useState } from "react";
import {
    createNotiRequest,
    getNotisRequest,
    deleteNotiRequest,
    getNotiRequest,
    updateNotiRequest,
    } from "../api/notis.js";

const NotiContext = createContext();

export const useNotis = () => {
    const context = useContext(NotiContext);

    if (!context) {
        throw new Error("useNotis must be used within a NotiProvider");
    }
    return context;
}

export function NotiProvider( { children } ){
    const [notis, setNotis] = useState([]); // Inicializa como array vacío

    // --- getTasks CORREGIDO ---
    const getNotis = async () => {
        try {
            const res = await getNotisRequest();
           // console.log("Respuesta de getTasksRequest:", res.data); // Log

            // Verifica si la respuesta es un array
            if (Array.isArray(res.data)) {
                setNotis(res.data);
            } else {
                console.error("API no devolvió un array en getTasks:", res.data);
                setNotis([]); // Establece array vacío
            }
        } catch (error) {
           console.error("Error en getTasks:", error.response?.data || error.message || error);
           setNotis([]); // Establece array vacío en caso de error
        }
    };

    const createNoti = async (task) =>{
       try {
            const res = await createNotiRequest(task);
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

    const deleteNoti = async (id) => {
        try {
            const res = await deleteNotiRequest(id);
            // El status 204 (No Content) es común para deletes exitosos
            if(res.status === 204) {
                // Filtra la tarea eliminada del estado actual
                setNotis(prevTasks => prevTasks.filter((task) => task._id !== id));
                console.log("Tarea eliminada:", id);
            } else {
                console.warn("Respuesta inesperada al eliminar tarea:", res);
            }
        } catch (error) {
            console.error("Error eliminando tarea:", error.response?.data || error.message || error);
        }
    };

    const getNoti = async (id) =>{
        try {
            const res = await getNotiRequest(id);
            // Devuelve los datos de la tarea específica
            return res.data;
        } catch (error) {
            console.error("Error obteniendo tarea:", id, error.response?.data || error.message || error);
            // Podrías devolver null o lanzar el error para que el componente lo maneje
            return null;
        }
    };

    const updateNoti = async (id, task) => {
        try {
            const res = await updateNotiRequest(id, task);
           // console.log("Tarea actualizada:", res.data);
            // Actualiza el estado localmente para reflejar el cambio
            setNotis(prevTasks => prevTasks.map(t =>
                t._id === id ? { ...t, ...res.data } : t // Asume que res.data contiene la tarea actualizada
            ));
        } catch (error) {
            console.error("Error actualizando tarea:", id, error.response?.data || error.message || error);
        }
    }

    return(
        <NotiContext.Provider
        value={{
            notis,
            createNoti,
            getNotis, // Función general para obtener tareas (quizás para TasksPage)
            deleteNoti,
            getNoti,
            updateNoti,// Función específica (quizás para HomePage)
        }}>
            {children}
        </NotiContext.Provider>
    );
}
