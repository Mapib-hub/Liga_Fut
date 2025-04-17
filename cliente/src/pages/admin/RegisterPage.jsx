import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
 
function RegisterPage(){
    const {register,
         handleSubmit,
         formState:{errors},
        } = useForm();
    const {signup, isAuthenticated, errors:RegisterErrors } = useAuth();
    const navigate = useNavigate();

    useEffect(()=> {
        if (isAuthenticated) navigate('/tasks');
    }, [isAuthenticated]);

    const onSubmit = handleSubmit(async (values)=>{
        //console.log(values);
        signup(values);
    });
    console.log('RegisterPage - Antes de mapear errores:', {
        RegisterErrors,
        isArray: Array.isArray(RegisterErrors),
        isAuthenticated // También útil ver esto
    });
    return(
        <div className="flex items-center justify-center">
             <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md">
            {/* Comprueba si RegisterErrors es un array y tiene elementos */}
            { Array.isArray(RegisterErrors) && RegisterErrors.length > 0 &&
                RegisterErrors.map((error, i) => (
                    <div className="bg-red-500 p-2 text-white text-center my-2" key={i}> {/* Añadí my-2 para espaciado */}
                        {/* Si el error es un objeto, intenta mostrar error.message */}
                        {typeof error === 'object' && error.message ? error.message : error}
                    </div>
                ))
            }
            <h1 className="text-2xl font-bold">Register</h1>
        <form onSubmit={onSubmit} >
        <input type="text" { ...register("username",{ required: true } )} 
        className="my-2 w-full bg-zinc-700 text-white px-4 py-2 rounded-md "
        placeholder="Username"/>
        {errors.username && <p className="text-red-500">Username is required</p>}

        <input type="email" { ...register("email", { required: true } )}
        className="my-2 w-full bg-zinc-700 text-white px-4 py-2 rounded-md "
        placeholder="Email"/>
        {errors.email && (<p className="text-red-500">Email is required</p>)}

        <input type="password" { ...register("password", { required: true } )}
        className="my-2 w-full bg-zinc-700 text-white px-4 py-2 rounded-md "
        placeholder="Password"/>
        {errors.password && (<p className="text-red-500">Password is required</p>)}

        <button type="submit"  className="bg-indigo-500 px-4 py-1 rounded-sm">Registrar</button>
        </form> <br />
            <p className="flex gap-x-2 justify-between">
                Ya tienes una cuenta??{" "} 
                <Link to="/login" className="text-sky-500">
                    Ingresa
                </Link>
            </p>
        </div>
   </div>
    );
}

export default RegisterPage;