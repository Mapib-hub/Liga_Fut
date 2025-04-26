// src/pages/LoginPage.jsx
import React, { useEffect } from 'react'; // Import React si no estaba
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom"; // Navigate ya estaba
import { FiLogIn } from 'react-icons/fi'; // Icono para el botón

function LoginPage() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    // Mantenemos sigin y siginErrors como en tu código original
    const { sigin, errors: siginErrors, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Mantenemos tu onSubmit original que llama a sigin
    const onSubmit = handleSubmit((data) => {
        sigin(data);
    });

    // Mantenemos tu useEffect original
    useEffect(() => {
        if (isAuthenticated) navigate("/admin");
    }, [isAuthenticated, navigate]); // Añadir navigate a dependencias

    return (
        // --- ESTILOS NUEVOS: Contenedor principal ---
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            {/* --- ESTILOS NUEVOS: Tarjeta --- */}
            <div className="max-w-md w-full space-y-8 bg-white p-8 md:p-10 shadow-xl rounded-lg border border-gray-200">

                {/* --- ESTILOS NUEVOS: Logo Placeholder --- */}
                <div className="flex justify-center">
                    <svg className="h-12 w-auto text-violet-700" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                    </svg>
                </div>

                {/* --- ESTILOS NUEVOS: Título --- */}
                <h1 className="mt-6 text-center text-3xl font-extrabold text-violet-800">
                    Login
                </h1>

                {/* --- ESTILOS NUEVOS: Errores Generales (usando siginErrors) --- */}
                {siginErrors && siginErrors.length > 0 && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
                        <strong className="font-bold">Error: </strong>
                        <ul>
                            {siginErrors.map((error, i) => (
                                <li key={i} className="block sm:inline ml-2">{error}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Formulario (onSubmit original) */}
                <form className="mt-8 space-y-6" onSubmit={onSubmit}>
                    {/* --- ESTILOS NUEVOS: Campo Email --- */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Correo Electrónico
                        </label>
                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            // Mantenemos tu register original
                            {...register("email", { required: true })}
                            // Clases de estilo nuevas
                            className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm`}
                            placeholder="tu@correo.com"
                        />
                        {/* Mantenemos tu mensaje de error original, con estilo nuevo */}
                        {errors.email && (<p className="mt-1 text-xs text-red-600">Email is required</p>)}
                    </div>

                    {/* --- ESTILOS NUEVOS: Campo Password --- */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Contraseña
                        </label>
                        <input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            // Mantenemos tu register original
                            {...register("password", { required: true })}
                            // Clases de estilo nuevas
                            className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm`}
                            placeholder="Contraseña"
                        />
                        {/* Mantenemos tu mensaje de error original, con estilo nuevo */}
                        {errors.password && (<p className="mt-1 text-xs text-red-600">Password is required</p>)}
                    </div>

                    {/* --- ESTILOS NUEVOS: Botón Submit --- */}
                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition duration-150 ease-in-out"
                        >
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                <FiLogIn className="h-5 w-5 text-violet-500 group-hover:text-violet-400" aria-hidden="true" />
                            </span>
                            Login {/* Texto original del botón */}
                        </button>
                    </div>
                </form>

                {/* --- ESTILOS NUEVOS: Enlaces Adicionales --- */}
                <div className="text-sm text-center mt-6">
                    <Link to="/" className="font-medium text-violet-600 hover:text-violet-500">
                        &larr; Volver al Inicio
                    </Link>
                    {/* Quitamos el enlace a Register que no estaba en tu original */}
                </div>

            </div>
        </div>
    );
}

export default LoginPage;
