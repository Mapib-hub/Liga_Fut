import { Children, createContext, useContext, useState } from "react";
import { getJugadoresRequest, 
    getJugadorRequest, 
    createJugadorRequest, 
    delelteJugadorRequest, 
    updateJugadorRequest,
    updateGolesRequest } from "../api/jugadores";

const JugadorContext = createContext();

export const useJugador = () =>{
    const context = useContext(JugadorContext);
    if(!context) {
        throw new Error("useJugador must be used withing a JugaProvider"); 
    }
    return context;
};

export function JugaProvider ({ children }) {
    const [juga, setJuga] = useState();
    
    const getJugadores = async () => {
        try {
            const res = await getJugadoresRequest();
            //console.log(res.data);
             setJuga(res.data);
          } catch (error) {
            console.log(error);
          }
        };
        const createJuga = async (task) => {
            const res = await createJugadorRequest(task)
            // console.log(res);
        };
        const deleteJuga = async (id) => {
          try {
              const res = await delelteJugadorRequest(id);
              if (res.status === 204) setJuga(juga.filter((task) => task._id !== id));
          } catch (error) {
              console.log(error)
          }
        };
        const getJuga = async (id) => {
            try {
                const res = await getJugadorRequest(id);
               /// console.log(res.data);
                return res.data;
            } catch (error) {
                console.log(error);
            }
          };
          const updateJuga = async (id, task) => {
           /* console.log(id);
            console.log(task);*/
           try {
                await updateJugadorRequest(id, task);
            } catch (error) {
                console.log(error);
            }
        };
        // En JugadoresContext.jsx (mejorado)
const updateGoles = async (id, newGoles) => { // Nombre más descriptivo, recibe el número directamente
    try {
      const dataToSend = { goles: newGoles }; // Prepara el objeto para la API
      const res = await updateGolesRequest(id, dataToSend); // Llama a la API
  
      // --- ACTUALIZACIÓN DE ESTADO LOCAL ---
      setJuga(prevJugadores =>
        prevJugadores.map(jugador =>
          jugador._id === id
            ? { ...jugador, goles: newGoles } // Actualiza solo los goles del jugador modificado
            : jugador
        )
      );
      // --- FIN ACTUALIZACIÓN ---
  
      return res.data; // Devuelve éxito (opcional)
  
    } catch (error) {
      console.error("Error en updateGolesJugador (Context):", error);
      // --- MANEJO DE ERRORES ---
      const errorMsg = error.response?.data?.message || "Error al actualizar goles";
      setErrors([errorMsg]); // Actualiza estado de errores (si lo tienes)
      throw error; // <-- RE-LANZA el error para que el componente lo capture (con Swal)
      // --- FIN MANEJO ---
    }
  };
  // No olvides exportarlo en el value del Provider: updateGolesJugador,
  
    

    return (
        <JugadorContext.Provider
        value={{
            juga,
            getJugadores,
            createJuga,
            deleteJuga,
            getJuga,
            updateJuga,
            updateGoles,
        }}
        >
            {children}
        </JugadorContext.Provider>
    );
}