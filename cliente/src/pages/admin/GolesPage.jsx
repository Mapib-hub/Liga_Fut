// src/pages/admin/GolesPage.jsx
import React, { useEffect, useState } from 'react';
import { useJugador } from '../../context/JugadorContext'; // Asegúrate que la ruta es correcta
import Swal from 'sweetalert2';
import { BACKEND_ORIGIN } from '../../config';

function GolesPage() {
  const { juga, getJugadores, updateGoles } = useJugador();
  const [searchTerm, setSearchTerm] = useState('');
  // Estado para los valores de los inputs de goles A SUMAR (clave: jugadorId, valor: string del input)
  const [golesASumarValues, setGolesASumarValues] = useState({});
  const [savingId, setSavingId] = useState(null);

  // Carga inicial de jugadores
  useEffect(() => {
    getJugadores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Inicializa los inputs a '0' cuando los jugadores cargan o cambian
  useEffect(() => {
    if (juga) {
      const initialValues = {};
      juga.forEach(jugador => {
        // Inicializa todos los inputs a '0'
        initialValues[jugador._id] = '0';
      });
      setGolesASumarValues(initialValues);
    }
  }, [juga]); // Se ejecuta cada vez que 'juga' cambia

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Handler para cambios en los inputs de goles A SUMAR
  const handleGolesInputChange = (playerId, value) => {
    // Permite solo números enteros no negativos
    const sanitizedValue = value.replace(/[^0-9]/g, '');
    setGolesASumarValues(prev => ({
      ...prev,
      [playerId]: sanitizedValue || '0', // Si se borra todo, vuelve a '0'
    }));
  };

  // Handler para SUMAR los goles de un jugador específico
  const handleSumarGoles = async (playerId, nombreJugador) => {
    const golesASumarStr = golesASumarValues[playerId];

    // Validación: no vacío, es un número entero no negativo
    if (golesASumarStr === undefined || golesASumarStr === null || golesASumarStr.trim() === '' || !/^\d+$/.test(golesASumarStr)) {
      Swal.fire('Error', 'Por favor, ingresa un número válido de goles a sumar (entero, no negativo).', 'error');
      return;
    }

    const golesASumarNum = parseInt(golesASumarStr, 10);

    // Si el valor a sumar es 0, no hacemos nada (evita llamadas innecesarias)
    if (golesASumarNum === 0) {
        // Opcional: Mostrar un mensaje sutil o simplemente no hacer nada
        // console.log(`No se sumarán goles para ${nombreJugador}.`);
        return;
    }

    setSavingId(playerId); // Marcar como guardando

    try {
      // Llama a la función del contexto que llama a updateGolesRequest
      // El backend espera un objeto { goles: cantidadASumar }
      await updateGoles(playerId, { goles: golesASumarNum });

      Swal.fire({
        title: '¡Goles Sumados!',
        text: `Se sumaron ${golesASumarNum} goles a ${nombreJugador || 'Jugador'}.`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        customClass: {
          title: 'text-green-600'
        }
      });

      // --- IMPORTANTE: Resetear el input a '0' después de sumar ---
      setGolesASumarValues(prev => ({
        ...prev,
        [playerId]: '0',
      }));
      // --- FIN RESET ---

      // La actualización del estado 'juga' (con el total actualizado) la hace el contexto.

    } catch (error) {
      console.error("Error al sumar goles (UI):", error);
      Swal.fire(
        'Error',
        error.response?.data?.message || 'Hubo un problema al sumar los goles.',
        'error'
      );
    } finally {
      setSavingId(null); // Quitar marca de guardando
    }
  };

  const filteredJugadores = (juga || []).filter(jugador =>
    (jugador.nombre?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (jugador.apellido?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (jugador.equip?.nombre?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Sumar Goles a Jugadores</h1>
      </div>

      {/* Barra de Búsqueda */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar jugador por nombre, apellido o equipo..."
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* Tabla de Goles */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th scope="col" className="px-6 py-3 elim400">Foto</th>
              <th scope="col" className="px-6 py-3">Nombre</th>
              <th scope="col" className="px-6 py-3">Apellido</th>
              <th scope="col" className="px-6 py-3 elim600">Equipo</th>
              {/* <th scope="col" className="px-6 py-3 text-center">Goles Actuales</th> COLUMNA ELIMINADA */}
              <th scope="col" className="px-6 py-3 text-center">Sumar Goles</th> {/* <-- ETIQUETA CAMBIADA */}
              <th scope="col" className="px-6 py-3 text-center">Acción</th>
            </tr>
          </thead>
          <tbody>
            {filteredJugadores && filteredJugadores.length > 0 ? (
              filteredJugadores.map((jugador) => (
                <tr key={jugador._id} className="bg-white border-b hover:bg-gray-50">
                  {/* Foto */}
                  <td className="px-6 py-4 elim400">
                    {jugador.foto_jug && jugador.foto_jug !== 'player.jpg' ? (
                      <img
                        src={`${BACKEND_ORIGIN}/uploads/jugadores/${jugador.foto_jug}`}
                        alt={`${jugador.nombre} ${jugador.apellido}`}
                        className="h-10 w-10 object-cover rounded-full"
                      />
                    ) : (
                      <span className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-xs text-gray-600">Sin Foto</span>
                    )}
                  </td>
                  {/* Nombre y Apellido */}
                  <td className="px-6 py-4 font-medium text-gray-900">{jugador.nombre}</td>
                  <td className="px-6 py-4">{jugador.apellido}</td>
                  {/* Equipo */}
                  <td className="px-6 py-4 elim600">{jugador.equip?.nombre || <span className="italic text-gray-500">Sin equipo</span>}</td>
                  {/* Goles Actuales (del estado 'juga') - COLUMNA ELIMINADA */}
                  {/* <td className="px-6 py-4 text-center font-semibold">
                    {jugador.goles !== undefined ? jugador.goles : 0}
                  </td> */}
                  {/* Input para Goles A SUMAR */}
                  <td className="px-6 py-4 text-center">
                    <input
                      type="number"
                      min="0" // Solo permitir sumar 0 o más
                      step="1"
                      value={golesASumarValues[jugador._id] || '0'} // Usa el valor del estado de inputs a sumar
                      onChange={(e) => handleGolesInputChange(jugador._id, e.target.value)}
                      className="w-20 px-2 py-1 border rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      aria-label={`Goles a sumar para ${jugador.nombre}`}
                      disabled={savingId === jugador._id}
                    />
                  </td>
                  {/* Botón Sumar */}
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleSumarGoles(jugador._id, `${jugador.nombre} ${jugador.apellido}`)} // Llama a la nueva función
                      className={`px-3 py-1 text-white text-xs font-medium rounded transition duration-200 ${
                        savingId === jugador._id
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-green-500 hover:bg-green-600' // Cambiado a verde para "Sumar"
                      }`}
                      disabled={savingId === jugador._id || (golesASumarValues[jugador._id] || '0') === '0'} // Deshabilita si es 0 o está guardando
                      title="Sumar Goles"
                    >
                      {savingId === jugador._id ? 'Sumando...' : 'Sumar'} {/* <-- TEXTO CAMBIADO */}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="bg-white border-b">
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500 italic"> {/* Ajusta colSpan */}
                  {searchTerm ? 'No se encontraron jugadores con ese criterio.' : 'No hay jugadores registrados.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GolesPage;
