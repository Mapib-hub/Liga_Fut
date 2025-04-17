// c:\Users\Acer\Desktop\proyectos\prueba_node\cliente\src\components\Navbar.jsx
import { useState, useEffect, useRef } from 'react'; // Necesitamos estado para el dropdown
import { Link, NavLink } from "react-router-dom"; // NavLink para estilo activo
import { useAuth } from "../context/AuthContext"; // Asegúrate que la ruta sea correcta

function Navbar() {
    const { isAuthenticated, logout, user } = useAuth();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // Estado para el menú desplegable
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Estado para menú móvil
    const userMenuRef = useRef(null); // Ref para detectar clics fuera del menú de usuario
    const mobileMenuRef = useRef(null); // Ref para detectar clics fuera del menú móvil

    // Estilos (puedes ajustar colores y fuentes)
    const baseLinkStyle = "px-3 py-2 rounded-md text-sm font-medium";
    const inactiveLinkStyle = `${baseLinkStyle} text-gray-300 hover:bg-gray-700 hover:text-white`;
    const activeLinkStyle = `${baseLinkStyle} bg-gray-900 text-white`; // Estilo para NavLink activo
    const buttonLinkStyle = "bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-sm font-medium";
    const mobileBaseLinkStyle = "block px-3 py-2 rounded-md text-base font-medium"; // Estilo base para móvil
    const mobileInactiveLinkStyle = `${mobileBaseLinkStyle} text-gray-300 hover:bg-gray-700 hover:text-white`;
    const mobileActiveLinkStyle = `${mobileBaseLinkStyle} bg-gray-900 text-white`;

    // Cerrar menús si se hace clic fuera
    useEffect(() => {
        function handleClickOutside(event) {
            // Cierra menú de usuario
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
            // Cierra menú móvil
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('#mobile-menu-button')) {
                 // Evita cerrar si se hace clic en el botón de hamburguesa
                setIsMobileMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [userMenuRef, mobileMenuRef]);


    return (
        <nav className="bg-zinc-800 shadow-md" ref={mobileMenuRef}> {/* Añadir ref al nav para detectar clics fuera del menú móvil */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Izquierda: Logo/Título */}
                    <div className="flex-shrink-0">
                        <Link to={isAuthenticated ? "/tasks" : "/"} className="text-white text-xl font-bold">
                            Tasks Manager {/* O tu logo/nombre de app */}
                        </Link>
                    </div>

                    {/* Centro: Links Principales (Ocultos en móvil por defecto) */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {isAuthenticated && (
                                <>
                                    <NavLink
                                        to="/tasks"
                                        className={({ isActive }) => isActive ? activeLinkStyle : inactiveLinkStyle}
                                    >
                                        Mis Tareas
                                    </NavLink>
                                    <NavLink
                                        to="/add-tasks"
                                        className={({ isActive }) => isActive ? activeLinkStyle : inactiveLinkStyle}
                                    >
                                        Agregar Tarea
                                    </NavLink>
                                    {/* Puedes añadir más links aquí si es necesario */}
                                    <NavLink
                                        to="/admin/noticias" // Añadido link a noticias
                                        className={({ isActive }) => isActive ? activeLinkStyle : inactiveLinkStyle}
                                    >
                                        Noticias Admin
                                    </NavLink>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Derecha: Autenticación / Menú de Usuario (Oculto en móvil por defecto) */}
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6">
                            {isAuthenticated ? (
                                // Menú Desplegable de Usuario
                                <div className="ml-3 relative" ref={userMenuRef}>
                                    <div>
                                        <button
                                            type="button"
                                            className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                                            id="user-menu-button"
                                            aria-expanded={isUserMenuOpen}
                                            aria-haspopup="true"
                                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        >
                                            <span className="sr-only">Abrir menú de usuario</span>
                                            {/* Avatar Placeholder (puedes reemplazar con una imagen) */}
                                            <span className="inline-block h-8 w-8 overflow-hidden rounded-full bg-gray-600">
                                                <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                                </svg>
                                            </span>
                                            <span className="text-white px-2 py-1 text-sm font-medium hidden lg:inline"> {/* Oculta nombre en pantallas medianas */}
                                                {user?.username || 'Usuario'} {/* Muestra username o 'Usuario' si no está disponible */}
                                            </span>
                                            <svg className="ml-1 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Dropdown Usuario */}
                                    {isUserMenuOpen && (
                                        <div
                                            className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20" // Aumentado z-index
                                            role="menu"
                                            aria-orientation="vertical"
                                            aria-labelledby="user-menu-button"
                                            tabIndex="-1"
                                        >
                                            <span className="block px-4 py-2 text-sm text-gray-500 italic">
                                                Hola, {user?.username || 'Usuario'}
                                            </span>
                                            <Link
                                                to="/profile"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                role="menuitem"
                                                tabIndex="-1"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                Tu Perfil
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    logout();
                                                    setIsUserMenuOpen(false);
                                                    setIsMobileMenuOpen(false); // También cierra menú móvil si está abierto
                                                }}
                                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700" // Estilo logout
                                                role="menuitem"
                                                tabIndex="-1"
                                            >
                                                Cerrar Sesión
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                // Botones Login/Register si no está autenticado
                                <div className="flex items-center space-x-4">
                                    <Link to='/login' className={buttonLinkStyle}>Login</Link>
                                    <Link to='/register' className={buttonLinkStyle}>Register</Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Botón Menú Móvil (Visible solo en pantallas pequeñas) */}
                    <div className="-mr-2 flex md:hidden">
                         <button
                            id="mobile-menu-button"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            type="button"
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                            aria-controls="mobile-menu"
                            aria-expanded={isMobileMenuOpen}
                         >
                             <span className="sr-only">Abrir menú principal</span>
                             {/* Icono: Hamburguesa si cerrado, X si abierto */}
                             {!isMobileMenuOpen ? (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                                </svg>
                             ) : (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                             )}
                         </button>
                     </div>

                </div>
            </div>

             {/* Menú Móvil Desplegable (Se muestra debajo del nav si isMobileMenuOpen es true) */}
             {isMobileMenuOpen && (
                <div className="md:hidden absolute w-full bg-zinc-800 z-10" id="mobile-menu"> {/* Posición absoluta y z-index */}
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {isAuthenticated ? (
                            <>
                                {/* Links Autenticados Móvil */}
                                <NavLink to="/tasks" className={({ isActive }) => isActive ? mobileActiveLinkStyle : mobileInactiveLinkStyle} onClick={() => setIsMobileMenuOpen(false)}>Mis Tareas</NavLink>
                                <NavLink to="/add-tasks" className={({ isActive }) => isActive ? mobileActiveLinkStyle : mobileInactiveLinkStyle} onClick={() => setIsMobileMenuOpen(false)}>Agregar Tarea</NavLink>
                                <NavLink to="/admin/noticias" className={({ isActive }) => isActive ? mobileActiveLinkStyle : mobileInactiveLinkStyle} onClick={() => setIsMobileMenuOpen(false)}>Noticias Admin</NavLink>
                                <NavLink to="/profile" className={({ isActive }) => isActive ? mobileActiveLinkStyle : mobileInactiveLinkStyle} onClick={() => setIsMobileMenuOpen(false)}>Tu Perfil</NavLink>
                                <button
                                    onClick={() => {
                                        logout();
                                        setIsMobileMenuOpen(false);
                                        setIsUserMenuOpen(false);
                                    }}
                                    className={`${mobileBaseLinkStyle} w-full text-left text-red-400 hover:bg-red-700 hover:text-white`}
                                >
                                    Cerrar Sesión
                                </button>
                            </>
                        ) : (
                            <>
                                {/* Links Públicos/Login Móvil */}
                                <NavLink to="/login" className={({ isActive }) => isActive ? mobileActiveLinkStyle : mobileInactiveLinkStyle} onClick={() => setIsMobileMenuOpen(false)}>Login</NavLink>
                                <NavLink to="/register" className={({ isActive }) => isActive ? mobileActiveLinkStyle : mobileInactiveLinkStyle} onClick={() => setIsMobileMenuOpen(false)}>Register</NavLink>
                                {/* Añade aquí links públicos si los tienes */}
                                <NavLink to="/" className={({ isActive }) => isActive ? mobileActiveLinkStyle : mobileInactiveLinkStyle} onClick={() => setIsMobileMenuOpen(false)}>Inicio</NavLink>
                                <NavLink to="/imagenes" className={({ isActive }) => isActive ? mobileActiveLinkStyle : mobileInactiveLinkStyle} onClick={() => setIsMobileMenuOpen(false)}>Imágenes</NavLink>
                            </>
                        )}
                    </div>
                </div>
             )}
        </nav>
    );
}

export default Navbar;
