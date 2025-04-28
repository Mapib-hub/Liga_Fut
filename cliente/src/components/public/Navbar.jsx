// src/components/public/layout/ExperimentalNavbar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHome, FiList, FiRss, FiUsers, FiCalendar, FiLogIn, FiMenu, FiX, FiAward } from 'react-icons/fi';

const navItems = [
  { to: "/", icon: FiHome, text: "Inicio" },
  { to: "/web/fixture", icon: FiCalendar, text: "Fixture" },
  { to: "/web/tabla", icon: FiList, text: "Tabla Posiciones" },
  { to: "/web/noticias", icon: FiRss, text: "Noticias" },
  { to: "/web/equipos", icon: FiUsers, text: "Equipos" },
  { to: "/web/goleadores", icon: FiAward, text: "Goleadores" },
  { to: "/login", icon: FiLogIn, text: "Login" },
];

const orbVariants = {
  closed: { scale: 1, rotate: 0 },
  open: { scale: 1.1, rotate: 180 },
};

const menuVariants = {
  closed: { opacity: 0, scale: 0.5, transition: { staggerChildren: 0.05, staggerDirection: -1 } },
  open: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 120, damping: 15, staggerChildren: 0.1 } },
};

const itemVariants = {
  closed: { opacity: 0, y: 20, scale: 0.8 },
  open: { opacity: 1, y: 0, scale: 1 },
};

function ExperimentalNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Botón Orbe Flotante */}
      <motion.button
        className="fixed top-5 right-5 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 shadow-lg flex items-center justify-center text-white focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        variants={orbVariants}
        animate={isOpen ? "open" : "closed"}
        whileHover={{ scale: 1.15, boxShadow: "0 0 20px rgba(128, 90, 213, 0.7)" }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={isOpen ? 'x' : 'menu'}
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </motion.div>
        </AnimatePresence>
      </motion.button>

      {/* Overlay de Fondo (opcional) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)} // Cierra al hacer clic fuera
          />
        )}
      </AnimatePresence>

      {/* Contenedor del Menú Radial (Aparece cerca del orbe) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed top-24 right-5 z-50 flex flex-col items-end space-y-3"
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.to;
              return (
                <motion.div key={index} variants={itemVariants}>
                  <Link
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-end space-x-3 px-4 py-2 rounded-full transition-all duration-200 ease-in-out ${
                      isActive
                        ? 'bg-white text-indigo-700 shadow-md scale-105'
                        : 'bg-indigo-800/80 text-white hover:bg-indigo-700 hover:scale-105 hover:shadow-lg backdrop-blur-sm'
                    }`}
                  >
                    <span className="text-sm font-medium">{item.text}</span>
                    <item.icon size={18} />
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default ExperimentalNavbar;
