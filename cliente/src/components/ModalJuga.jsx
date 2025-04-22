// src/components/ModalJuga.jsx
import React, { useState, useEffect } from 'react';
import { useJugador } from '../context/JugadorContext'; // Context de Jugadores
import { useEquipos } from '../context/EquiposContext'; // Context de Equipos
import Swal from 'sweetalert2';
import { BACKEND_ORIGIN } from "../config"; // URL Base del Backend

// --- CONSTANTES ---
const POSICIONES = ["Portero", "Defensa", "Mediocampista", "Delantero"]; // Opciones para el select de posición

// Helper para formatear fecha (YYYY-MM-DD)
const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  try {
    // Intenta crear la fecha, si es inválida, devuelve vacío
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    // Asegura que la fecha no sea del futuro lejano o pasado muy lejano (simple validación)
    const year = date.getFullYear();
    if (year < 1900 || year > new Date().getFullYear() + 1) return '';

    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0'); // Usa getDate() para el día del mes
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error("Error formateando fecha:", error);
    return '';
  }
};


function ModalJuga({ isOpen, onClose, jugadorActual }) {
  const { createJuga, updateJuga, getJuga } = useJugador(); // Funciones del contexto Jugador
  const { equipos, getEquipos } = useEquipos(); // Equipos para el select

  // Estado del formulario (campos coinciden con el MODELO CORRECTO)
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '', // Opcional
    fecha_nac: '',
    posicion: '', // Opcional, pero con enum
    equip: '', // ID del equipo
  });
  const [imageFile, setImageFile] = useState(null); // Archivo de imagen seleccionado
  const [previewUrl, setPreviewUrl] = useState(null); // URL para previsualizar nueva imagen
  const [currentImageUrl, setCurrentImageUrl] = useState(null); // URL de la imagen actual (al editar)
  const [isLoadingData, setIsLoadingData] = useState(false); // Estado de carga

  // Cargar equipos cuando el modal se abre
  useEffect(() => {
    if (isOpen) {
      getEquipos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Cargar datos del jugador al editar o resetear al crear
  useEffect(() => {
    const loadJugadorData = async () => {
      if (isOpen) {
        if (jugadorActual?._id) { // Verifica si hay un jugador para editar
          setIsLoadingData(true);
          try {
            // Llama a getJuga para obtener datos frescos (opcional pero bueno si los datos pueden cambiar)
            // const data = await getJuga(jugadorActual._id); // Descomenta si quieres datos frescos
            const data = jugadorActual; // Usa los datos pasados por prop

            setFormData({
              nombre: data.nombre || '',
              apellido: data.apellido || '',
              email: data.email || '',
              fecha_nac: formatDateForInput(data.fecha_nac), // Formatea fecha
              posicion: data.posicion || '', // Usa valor del jugador o vacío
              equip: data.equip?._id || data.equip || '', // Usa _id si está populado, o el ID directo
            });
            if (data.foto_jug && data.foto_jug !== 'player.jpg') { // Muestra si no es la default
              setCurrentImageUrl(`${BACKEND_ORIGIN}/uploads/jugadores/${data.foto_jug}`);
            } else {
              setCurrentImageUrl(null);
            }
          } catch (error) {
            console.error("Error cargando datos del jugador:", error);
            Swal.fire('Error', 'No se pudieron cargar los datos del jugador.', 'error');
            // Opcional: cerrar modal si falla la carga
            // onClose();
          } finally {
            setIsLoadingData(false);
            setImageFile(null); // Resetea selección de archivo
            setPreviewUrl(null); // Resetea previsualización
          }
        } else {
          // Creando: Resetea el formulario
          setFormData({
            nombre: '', apellido: '', email: '', fecha_nac: '', posicion: '', equip: ''
          });
          setImageFile(null);
          setPreviewUrl(null);
          setCurrentImageUrl(null);
          setIsLoadingData(false);
        }
      }
    };

    loadJugadorData();
  }, [isOpen, jugadorActual, getJuga]); // Depende de isOpen y jugadorActual

  // Manejadores
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validación básica (opcional, ya la tienes en el otro modal)
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => { setPreviewUrl(reader.result); };
      reader.readAsDataURL(file);
      setCurrentImageUrl(null); // Oculta imagen actual al previsualizar nueva
    } else {
      setImageFile(null);
      setPreviewUrl(null);
      // Restaura imagen actual si se cancela selección
      if (jugadorActual?.foto_jug && jugadorActual.foto_jug !== 'player.jpg') {
        setCurrentImageUrl(`${BACKEND_ORIGIN}/uploads/jugadores/${jugadorActual.foto_jug}`);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSubmit = new FormData();

    // Añadir campos del estado al FormData (usando claves del MODELO)
    dataToSubmit.append('nombre', formData.nombre);
    dataToSubmit.append('apellido', formData.apellido);
    if (formData.email) dataToSubmit.append('email', formData.email); // Solo si hay email
    dataToSubmit.append('fecha_nac', formData.fecha_nac);
    if (formData.posicion) dataToSubmit.append('posicion', formData.posicion); // Solo si hay posición
    dataToSubmit.append('equip', formData.equip); // Envía el ID del equipo

    // Añadir archivo si existe (clave 'foto_jug' coincide con modelo/multer)
    if (imageFile) {
      dataToSubmit.append('foto_jug', imageFile);
    }

    try {
      if (jugadorActual) {
        await updateJuga(jugadorActual._id, dataToSubmit);
        Swal.fire('¡Actualizado!', 'El jugador ha sido actualizado.', 'success');
      } else {
        await createJuga(dataToSubmit);
        Swal.fire('¡Creado!', 'El jugador ha sido creado.', 'success');
      }
      onClose(); // Cierra el modal
    } catch (error) {
      console.error('Error al guardar jugador:', error);
      // Intenta mostrar un mensaje más específico si el backend lo envía
      const errorMsg = error.response?.data?.message || 'Hubo un problema al guardar el jugador.';
      Swal.fire('Error', errorMsg, 'error');
    }
  };

  // No renderizar si no está abierto
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full flex justify-center items-center z-50">
      <div className="relative p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <form onSubmit={handleSubmit}>
          {/* Cabecera */}
          <div className="flex justify-between items-center pb-3 border-b">
            <h3 className="text-xl font-medium text-gray-900">
              {jugadorActual ? 'Editar Jugador' : 'Crear Nuevo Jugador'}
            </h3>
            <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" onClick={onClose} aria-label="Close">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Indicador de Carga */}
          {isLoadingData && <div className="text-center py-4">Cargando datos...</div>}

          {/* Cuerpo del Formulario (Grid) - Oculto mientras carga */}
          {!isLoadingData && (
            <div className="modal-body pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Columna 1 */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="nombre" className="label-form">Nombre</label>
                  <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} className="input-form" required />
                </div>
                <div>
                  <label htmlFor="apellido" className="label-form">Apellido</label>
                  <input type="text" id="apellido" name="apellido" value={formData.apellido} onChange={handleChange} className="input-form" required />
                </div>
                 <div>
                  <label htmlFor="email" className="label-form">Email (Opcional)</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="input-form" />
                </div>
                <div>
                  <label htmlFor="fecha_nac" className="label-form">Fecha Nacimiento</label>
                  <input type="date" id="fecha_nac" name="fecha_nac" value={formData.fecha_nac} onChange={handleChange} className="input-form" required />
                </div>
              </div>

              {/* Columna 2 */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="posicion" className="label-form">Posición (Opcional)</label>
                  <select id="posicion" name="posicion" value={formData.posicion} onChange={handleChange} className="input-form">
                    <option value="">Seleccione una posición</option>
                    {POSICIONES.map(pos => (
                      <option key={pos} value={pos}>{pos}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="equip" className="label-form">Equipo</label>
                  <select id="equip" name="equip" value={formData.equip} onChange={handleChange} className="input-form" required>
                    <option value="" disabled>Seleccione un equipo</option>
                    {/* Asegúrate que 'equipos' no sea undefined antes de mapear */}
                    {(equipos || []).map(equipo => (
                      <option key={equipo._id} value={equipo._id}>{equipo.nombre}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="foto_jug" className="label-form">Foto</label>
                  <input type="file" id="foto_jug" name="foto_jug" accept="image/*" onChange={handleFileChange} className="input-file-form" />
                  <p className="text-xs text-gray-500 mt-1">{jugadorActual ? 'Sube una nueva foto para reemplazar la actual.' : 'Sube una foto del jugador.'}</p>
                </div>
                {/* Previsualización */}
                {(previewUrl || currentImageUrl) && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700 mb-1">{previewUrl ? 'Nueva Foto:' : 'Foto Actual:'}</p>
                    <img src={previewUrl || currentImageUrl} alt="Previsualización" className="max-h-24 w-auto rounded border" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Pie (Botones) */}
          <div className="modal-footer flex justify-end pt-4 border-t mt-4">
            <button type="button" className="btn-cancel mr-2" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-save" disabled={isLoadingData}> {/* Deshabilitar mientras carga */}
              {jugadorActual ? 'Guardar Cambios' : 'Crear Jugador'}
            </button>
          </div>
        </form>
      </div>
      {/* Estilos rápidos (igual que antes) */}
      <style jsx>{`
        .label-form { display: block; margin-bottom: 0.25rem; font-size: 0.875rem; font-weight: 500; color: #374151; }
        .input-form { display: block; width: 100%; padding: 0.5rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; box-shadow: inset 0 1px 2px rgba(0,0,0,0.05); }
        .input-form:focus { border-color: #4f46e5; outline: 0; box-shadow: 0 0 0 0.2rem rgba(79, 70, 229, 0.25); }
        .input-file-form { display: block; width: 100%; font-size: 0.875rem; color: #6b7280; }
        .input-file-form::file-selector-button { margin-right: 1rem; padding: 0.5rem 1rem; border-radius: 9999px; border-width: 0; font-size: 0.875rem; font-weight: 600; background-color: #e0e7ff; color: #4338ca; cursor: pointer; }
        .input-file-form::file-selector-button:hover { background-color: #c7d2fe; }
        .btn-cancel { background-color: #6b7280; color: white; font-weight: bold; padding: 0.5rem 1rem; border-radius: 0.375rem; transition: background-color 0.2s; }
        .btn-cancel:hover { background-color: #4b5563; }
        .btn-save { background-color: #4f46e5; color: white; font-weight: bold; padding: 0.5rem 1rem; border-radius: 0.375rem; transition: background-color 0.2s; }
        .btn-save:hover { background-color: #4338ca; }
        .btn-save:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>
    </div>
  );
}

export default ModalJuga;
