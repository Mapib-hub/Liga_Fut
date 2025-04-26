// cliente/src/context/PublicContex.jsx
// SIN useMemo en la importación (a menos que lo uses para otra cosa)
import { createContext, useContext, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getCarruselPublic, getEquipoRequest, getNoticiasPublic,
    getEquiposRequest, getNoticiasPublic_3,
    getNoticiaPublic, getFechasRequest, getJugadoresRequest,
    getJugadorRequest, getGoleadoresPublic} from "../api/publicroutes";

const PublicContext = createContext();

export const usePublic = () =>{
    const context = useContext(PublicContext);
    if(!context) {
        throw new Error("usePublic must be used withing a PublicProvider");
    }
    return context;
};

export function PublicProvider ({ children }) {

    const [publico, setPublic] = useState([]);
    const [equipos, setEquipos] = useState([]);
    const [carrusel, setCarrusel] = useState([]);
    const [goleador, setGoleador] = useState([]);
    const [jugadoresData, setJugadoresData] = useState({ jugadores: [], totalJugadores: 0 });
    const [fechas, setFechas] = useState([]);

    // --- Funciones memoizadas con useCallback ---
    const getJuga = useCallback(async () => {
        try {
            const res = await getJugadoresRequest();
            // Guardar el objeto completo recibido de la API
            setJugadoresData(res.data || { jugadores: [], totalJugadores: 0 });
        } catch (error) {
            console.error("Error en getJuga:", error);
            setJugadoresData({ jugadores: [], totalJugadores: 0 }); // Estado limpio en error
        }
    }, []);
    const getgoleadores = useCallback(async () => {
        try {
            const res = await getGoleadoresPublic();
            const goleadoresData = res.data || { jugadores: [], totalJugadores: 0 };
            setGoleador(goleadoresData);
            //console.log(goleadoresData); // <-- ACÁ el return
        } catch (error) {
            console.error("Error en getJuga:", error);
            throw error; // <-- también podés tirar el error para atraparlo en el componente
        }
    }, []);
    
    const getJug = useCallback(async (id) => {
        try {
            const res = await getJugadorRequest(id);
            return res.data;
        } catch (error) {
            console.error("Error al obtener los datos del jugador (getJug):", error);
            return null;
        }
    }, []);

    const getCarrusel = useCallback(async () => {
        try {
            const res = await getCarruselPublic();
            setCarrusel(res.data);
        } catch (error) {
            console.error("Error en getCarrusel:", error);
        }
    }, []);

    const getNotis_3 = useCallback(async () => {
        try {
            const res = await getNoticiasPublic_3();
            setPublic(res.data);
        } catch (error) {
            console.error("Error en getNotis_3:", error);
        }
    }, []);

    const getNotis = useCallback(async () => {
        try {
            const res = await getNoticiasPublic();
            setPublic(res.data);
        } catch (error) {
            console.error("Error en getNotis:", error);
        }
    }, []);

    const getNoti = useCallback(async (id) => {
       try {
            const res = await getNoticiaPublic(id);
            return res.data;
        } catch (error) {
            console.error("Error en getNoti:", error);
            return null;
        }
    }, []);

    const getEquipos = useCallback(async () => {
        try {
            const res = await getEquiposRequest();
            setEquipos(res.data);
        } catch (error) {
            console.error("Error en getEquipos:", error);
        }
    }, []);

    const getEquipo = useCallback(async (id) => {
        try {
            const res = await getEquipoRequest(id);
            return res.data;
        } catch (error) {
            console.error("Error en getEquipo:", error);
            return null;
        }
    }, []);

    const getFechas = useCallback(async () => {
        try {
            const res = await getFechasRequest();
            setFechas(res.data);
           // console.log(res);
        } catch (error) {
            console.error("Error en getFechas:", error);
        }
    }, []);

    // --- SIN Memoización del objeto value ---
    return (
        <PublicContext.Provider value={{
            publico,
            equipos,
            carrusel,
            // Exponer los datos como los necesitabas antes
            jugadores: jugadoresData.jugadores, // Extrae el array del estado
            goleador,
            fechas,
            getFechas,
            getJuga,
            getCarrusel,
            getEquipos,
            getEquipo,
            getNotis,
            getNotis_3,
            getNoti,
            getJug,
            getgoleadores
        }}>
            {children}
        </PublicContext.Provider>
    );
}
