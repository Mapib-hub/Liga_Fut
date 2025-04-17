// import { useTasks } from "../context/TasksContext"; // <-- Ya no se necesita
import { Link } from "react-router-dom";
import swal from "sweetalert";

// Recibe 'onDelete' como prop
function TablaTask({ task, onDelete }){// const {deleteTask} = useTasks(); // <-- Ya no se necesita

    // Simplificamos la llamada, usamos 'task' del scope del componente
    const mostrarAlerta = () => {
         swal({
            title:"Eliminar",
            text:"¿Estás seguro que deseas eliminar?", // Corregido
            icon: "warning",
            buttons: ["No" , "Si"]
        }).then(respuesta => {
            if(respuesta){
                // Llama a la función onDelete pasada por props con el ID
                onDelete(task._id);
                swal({
                    text:"El archivo ha sido eliminado", // Corregido
                    icon:"success",
                    timer: 2000 // Timer como número
                });
            }
        });
    };

    // Asumimos que la ruta de edición es la misma por ahora,
    // o que TaskFormPage puede manejar ambos tipos por ID.
    // Si no, esto también podría pasarse como prop.
    const editPath = `/tasks/${task._id}`;

    // Asumimos que la propiedad de imagen es 'img' para ambos
    // y la ruta base es la misma. Si no, esto también necesita ajuste.
    const imageUrl = task.img ? `/imagenes/usuarios/${task.img}` : null; // Manejar si no hay imagen

    return(
        <tr className="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600">
            <td>{task.tittle}</td>
            <td className="text-center max-w-md">{task.description}</td>
            <td className="text-center max-w-sm">
                {imageUrl ? (
                    <img src={imageUrl} alt={task.tittle || 'Imagen'} width={"30%"} className=" rounded border bg-white p-1 dark:border-neutral-700 dark:bg-neutral-800 inline " />
                ) : (
                    <span>N/A</span> // Mostrar algo si no hay imagen
                )}
            </td>
            <td>
                {/* Llama a mostrarAlerta sin argumentos, usará 'task' del scope */}
                <button
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 clear-both rounded-md "
                    onClick={mostrarAlerta} // Simplificado
                >
                    delete
                </button>
                <br/><br/>
                <Link to={editPath} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md ">edit</Link>
            </td>
        </tr>
    );
}

export default TablaTask;
