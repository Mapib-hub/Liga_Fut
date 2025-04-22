import { createContext, useContext, useState } from "react";
import { deleltePartidoRequest, getCalendarioRequest, 
  createPartidoRequest, getPartidoRequest, 
  updatePartidoRequest, updateGolesRequest } from "../api/calendario";

const CalendarioContext = createContext();

export const useCalen = () => {
  const context = useContext(CalendarioContext);
  if (!context) {
    throw new Error("useCalen must be used withing a CalendarProvider");
  }
  return context;
};

export function CalendarProvider({ children }) {
    const [calendario, setCalendario] = useState();

    const getCalendario = async () => {
        try {
          const res = await getCalendarioRequest();
          setCalendario(res.data);
         /// console.log(res);
        } catch (error) {
          console.log(error);
        }
      };
      const crearPartido = async (task) => {
        try {
          const res = await createPartidoRequest(task)
          console.log(res);
      } catch (error) {
          console.log(error);
      }
          
      };
      const getPartido = async (id) => {
        try {
            const res = await getPartidoRequest(id);
            ///console.log(res.data);
            return res.data;
        } catch (error) {
            console.log(error);
        }
      };
      const editarPartido = async (id, task) => {
        try {
          //console.log(task)
          await updatePartidoRequest(id, task);
        } catch (error) {
            console.log(error);
        }
      };
      const editarGoles = async (id, task) => {
        try {
         // console.log(task)
          await updateGolesRequest(id, task);
        } catch (error) {
            console.log(error);
        }
      };
      const deletePartido = async (id) => {
       // console.log(id)
        try {
            const res = await deleltePartidoRequest(id);
            if (res.status === 204) setCalendario(calendario.filter((task) => task._id !== id));
        } catch (error) {
            console.log(error)
        }
      };


    return (
        <CalendarioContext.Provider
          value={{
            calendario,
            getCalendario,
            crearPartido,
            getPartido,
            editarGoles,
            editarPartido,
            deletePartido,
          }}
        >
          {children}
        </CalendarioContext.Provider>
      );
}