// c:\Users\Acer\Desktop\proyectos\prueba_node\cliente\src\pages\admin\NotisPage.jsx
import { useEffect } from "react";
import { useNotis } from "../../context/NotisContext.jsx";
// import TaskCard from "../../components/TaskCard.jsx"; // No usado
import TablaTask from "../../components/TablaTask.jsx";

function NotisPage(){
    // Obtén deleteNoti del contexto
    const { getNotis, notis, deleteNoti } = useNotis();

    useEffect(() =>{
        getNotis()
    }, []);

    // Mejor validación y mensaje
    if (!notis || notis.length === 0) return (<h1>No hay Noticias</h1>);

    return (
        <div className="min-w-lg grid gap-4 row-span-3">
        <table className="min-w-full text-left text-sm font-light">
            <thead className="border-b font-medium dark:border-neutral-500">
                <tr>
                <th>Titulo</th>
                <th>Descripcion</th>
                <th>Imagen </th>
                <th>Acciones</th> {/* Cambiado th */}
                </tr>
            </thead>
            <tbody>
            {notis.map((task) =>(
                // Pasa la función deleteNoti como prop onDelete
                <TablaTask
                    task={task}
                    key={task._id}
                    onDelete={deleteNoti} // <-- Aquí está la magia
                />
            ))}
            </tbody>
        </table>
        </div>
    );
}

export default NotisPage;
