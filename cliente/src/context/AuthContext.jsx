import { createContext, useState, useContext, useEffect } from "react";
import { registerRequest, loginRequest, verifyToquenRequet } from "../api/auth";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context){
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({children})=> {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [errors, setErrors] = useState([]); // Inicializado como array vacío
    const [loading, setLoading] = useState(true);

    const signup = async (user)=> {
        try {
            const res = await registerRequest(user);
            console.log("Signup exitoso:", res.data); // Log de éxito
            setUser(res.data);
            setIsAuthenticated(true);
            setErrors([]); // Limpia errores al registrarse exitosamente
        }  catch (error) {
            const errorData = error.response?.data; // Obtén los datos del error una vez
            console.error("Error en signup:", errorData || error.message); // Loguea el error real

            // Asegúrate de que lo que pasas a setErrors sea SIEMPRE un array
            if (Array.isArray(errorData)) {
                setErrors(errorData);
            } else if (typeof errorData === 'object' && errorData.message) {
                setErrors([errorData.message]); // Envuelve el mensaje del objeto en un array
            } else if (typeof errorData === 'string') {
                setErrors([errorData]); // Envuelve el string en un array
            } else {
                // Si no hay datos específicos, usa un mensaje genérico
                setErrors(["Error durante el registro"]);
            }
        }
    };

    // --- Función sigin CORREGIDA ---
    const sigin = async (user) => {
        try {
            const res = await loginRequest(user);
            //console.log("Login exitoso:", res.data); // Log de éxito
            setIsAuthenticated(true);
            setUser(res.data);
            setErrors([]); // Limpia errores al hacer login exitoso
        } catch (error) {
            const errorData = error.response?.data; // Obtén los datos del error una vez
            console.error("Error en sigin:", errorData || error.message); // Loguea el error real

            // Asegúrate de que lo que pasas a setErrors sea SIEMPRE un array
            if (Array.isArray(errorData)) {
                setErrors(errorData);
            } else if (typeof errorData === 'object' && errorData.message) {
                setErrors([errorData.message]); // Envuelve el mensaje del objeto en un array
            } else if (typeof errorData === 'string') {
                setErrors([errorData]); // Envuelve el string en un array
            } else {
                // Si no hay datos específicos, usa un mensaje genérico
                setErrors(["Credenciales inválidas o error desconocido"]);
            }
            // No es necesario un 'return' aquí, setErrors actualiza el estado
        }
    };
    // --- Fin de la función sigin corregida ---

    const logout = () => {
        Cookies.remove("token");
        setIsAuthenticated(false);
        setUser(null);
        setErrors([]); // También es bueno limpiar errores al hacer logout
    }

    // Efecto para limpiar errores después de 5 segundos
    useEffect (() => {
        if(errors.length > 0){
            const timer = setTimeout(() =>{
                setErrors([])
            }, 5000)
             // Limpia el temporizador si el componente se desmonta o si los errores cambian antes de 5s
             return () => clearTimeout(timer)
        }
    }, [errors]);

    // Efecto para verificar el login al cargar la app
    useEffect(()=>{
       async function checkLogin(){
            const cookies = Cookies.get();

            if (!cookies.token){
                setIsAuthenticated(false);
                setLoading(false);
                setUser(null); // Asegúrate de limpiar el usuario también
                return; // Sal temprano si no hay token
            }

           try {
                // Llama a tu endpoint de verificación de token
                const res = await verifyToquenRequet(cookies.token);
                //console.log("Resultado verificación token:", res);

                // Si la respuesta no contiene datos (o el backend indica token inválido)
                if(!res.data) {
                    setIsAuthenticated(false);
                    setUser(null); // Limpia usuario
                    Cookies.remove("token"); // Remueve la cookie inválida
                } else {
                    // Si la verificación fue exitosa
                    setIsAuthenticated(true);
                    setUser(res.data); // Establece los datos del usuario
                }

           } catch (error) {
                // Si hay un error en la petición (ej. 401 Unauthorized)
                console.error("Error verificando token:", error.response?.data || error.message);
                setIsAuthenticated(false);
                setUser(null);
                Cookies.remove("token"); // Remueve la cookie inválida
           } finally {
                // Asegúrate de que loading se ponga en false en todos los casos
                setLoading(false);
           }
       }
      checkLogin();
    }, []); // Se ejecuta solo una vez al montar el componente


    return (
        <AuthContext.Provider value={{
            signup,
            sigin,
            logout,
            loading,
            user,
            isAuthenticated,
            errors
        }}>
            {children}
        </AuthContext.Provider>
    );
};
