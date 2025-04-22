import { Children, createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCarruselPublic, getEquipoRequest, getNoticiasPublic, 
    getEquiposRequest, getNoticiasPublic_3, 
    getNoticiaPublic, getFechasRequest, getJugadoresRequest,
    getJugadorRequest } from "../api/publicroutes";



const PublicContext = createContext();

export const usePublic = () =>{
    const context = useContext(PublicContext);
    if(!context) {
        throw new Error("usePublic must be used withing a PublicProvider"); 
    }
    return context;
};

export function PublicProvider ({ children }) {

const [publico, setPublic] = useState();
const [equipos, setEquipos] = useState();
const [carrusel, setCarrusel] = useState();
const [jugadores, setJugadores] = useState();
const [fechas, setFechas] = useState();
    
const getJuga = async () => {
    try {
        const res = await getJugadoresRequest();
        //console.log(res.data);
        setJugadores(res.data);
      } catch (error) {
        console.log(error);
      }
    };   
    const getJug = async (id) => {
        try {
          const res = await getJugadorRequest(id);
          console.log(res);
          return res.data; // Devolvemos los datos
        } catch (error) {
          console.error("Error al obtener los datos del jugador:", error);
           res.send("/web/jugadores/"); // Lanzamos el error para que `useEffect` lo maneje
        }
      };
const getCarrusel = async () => {
        try {
            const res = await getCarruselPublic();
            //console.log(res.data);
            setCarrusel(res.data);
          } catch (error) {
            console.log(error);
          }
        };
        const getNotis_3 = async () => {
            try {
                const res = await getNoticiasPublic_3();
                //console.log(res.data);
                setPublic(res.data);
              } catch (error) {
                console.log(error);
              }
            };
            const getNotis = async () => {
                try {
                    const res = await getNoticiasPublic();
                    //console.log(res.data);
                    setPublic(res.data);
                  } catch (error) {
                    console.log(error);
                  }
                };
                const getNoti = async (id) => {
                    //console.log(id);
                   try {
                        const res = await getNoticiaPublic(id);
                        //console.log(res.data);
                        return res.data;
                    } catch (error) {
                        console.log(error);
                    }
                };
        const getEquipos = async () => {
                try {
                    const res = await getEquiposRequest();
                    //console.log(res);
                    setEquipos(res.data);
                    ;
                } catch (error) {
                    console.log(error);
                }
            };
            const getEquipo = async (id) => {
                    try {
                        const res = await getEquipoRequest(id);
                        //console.log(res.data);
                        return res.data;
                    } catch (error) {
                        console.log(error);
                    }
                };
                const getFechas = async () => {
                    try {
                        const res = await getFechasRequest();
                        //console.log(res);
                        setFechas(res.data);
                        ;
                    } catch (error) {
                        console.log(error);
                    }
                };
    
    return (
        <PublicContext.Provider
        value={{
           publico,
           equipos,
           carrusel,
           jugadores,
           fechas,
           getFechas,
           getJuga,
           getCarrusel,
           getEquipos,
           getEquipo,
           getNotis,
           getNotis_3,
           getNoti,
           getJug
        }}
        >
            {children}
        </PublicContext.Provider>
    );
}