import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";

function LoginPage(){
    const{ 
        register,
        handleSubmit,
        formState: { errors },
         } = useForm();
         const {sigin, errors: siginErrors, isAuthenticated } = useAuth();
         const navigate = useNavigate();

    const onSubmit = handleSubmit ((data) =>{
        sigin(data);
    });

    useEffect(()=>{
        if(isAuthenticated) navigate("/admin");
    }, [isAuthenticated]);

    return(
        <div className="flex items-center justify-center mt-10">
            <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md"> 
            {
                
                siginErrors.map((error, i)=> (
                    <div className="bg-red-500 p-2 text-white my-2 text-center" key={i}>
                        {error}
                    </div>
                   
                ))
            }
                <h1 className="text-2xl font-bold">Login</h1>
                <form onSubmit={onSubmit} >
                    <input type="email" { ...register("email", { required: true } )}
                    className="my-2 w-full bg-zinc-700 text-white px-4 py-2 rounded-md "
                    placeholder="Email"/>
                    {errors.email && (<p className="text-red-500">Email is required</p>)}

                    <input type="password" { ...register("password", { required: true } )}
                    className="my-2 w-full bg-zinc-700 text-white px-4 py-2 rounded-md "
                    placeholder="Password"/>
                    {errors.password && (<p className="text-red-500">Password is required</p>)}

                    <button type="submit"  className="bg-indigo-500 px-4 py-1 rounded-sm">Login</button>
                </form> <br />
               

            </div>
        </div>
    )
}

export default LoginPage;