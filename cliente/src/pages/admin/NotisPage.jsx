// c:\Users\Acer\Desktop\proyectos\prueba_node\cliente\src\pages\admin\NotisPage.jsx
import { useEffect } from "react";
import { useNotis } from "../../context/NotisContext.jsx";
import TablaTask from "../../components/TablaTask.jsx";

function NotisPage(){
    const { getNotis, notis, deleteNoti } = useNotis();

    useEffect(() =>{
        getNotis()
    }, []); // Se ejecuta al montar

    return (
        <div className="min-w-lg grid gap-4 row-span-3">
        <table className="min-w-full text-left text-sm font-light">
            <thead className="border-b font-medium dark:border-neutral-500">
                <tr>
                <th>Titulo</th>
                <th>Descripcion</th>
                <th>Imagen </th>
                <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
           
            { Array.isArray(notis) && notis.length > 0 ? (
                notis.map((task) =>(
                    <TablaTask
                        task={task}
                        key={task._id}
                        onDelete={deleteNoti}
                    />
                ))
             ) : (
                // Opcional: Muestra una fila indicando que no hay datos o está cargando
                <tr>
                    <td colSpan="4" className="text-center py-4">
                        {/* Puedes diferenciar entre carga inicial y sin datos si tienes un estado de carga */}
                        No hay noticias para mostrar.
                    </td>
                </tr>
             )}
            {/* --- FIN DE LA COMPROBACIÓN --- */}
            </tbody>
        </table>
        </div>
    );
}

export default NotisPage;
