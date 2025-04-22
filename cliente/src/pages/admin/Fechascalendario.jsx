import React, { useEffect, useState } from "react";
//import ModalPartido from "../../components/ModalFecha.jsx"; // Modal reutilizable para Crear/Editar partidos
//import Datatable from "react-data-table-component";
import Swal from "sweetalert2";
import { useFechas } from "../../context/FechaContext.jsx";
import { Link } from "react-router-dom";


function Partidos() {
  const [load, setLoad] = useState(null); // ID del partido seleccionado para editar
  const { fechas, getfechas, deleteFecha} = useFechas();

  useEffect(() => {
    getfechas();
  }, [fechas]);
console.log(fechas);
  const renderOptions = (row) => (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <button
        className="btn btn-warning btn_op"
        data-toggle="modal"
        data-target="#modal-partido"
        onClick={() => {
          //console.log(row._id),
          setLoad(row._id); // Carga el ID para edición
        }}
      >
        Editar
      </button>
      <button
        className="btn btn-danger"
        onClick={() => {
          handleDelete(row._id);
        }}
      >
        Eliminar
      </button>
    </div>
  );

  const columnas = [
    { name: "Nombre", selector: (row) => row.nombre || "N/A"  },
    {name: "Fecha", selector: (row) => new Date(row.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' })},
    { name: "Opciones", cell: (row) => renderOptions(row) },
    //console.log(row);const fecha = new Date(data.fecha).toLocaleDateString();
  ];

  const handleDelete = (id) => {
    Swal.fire({
      title: "¿Estás seguro de eliminar ela Fecha?",
      text: "Esta acción es irreversible.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteFecha(id)
          .then(() => {
            Swal.fire("Eliminado", "La Fecha ha sido eliminada.", "success");
            getfechas(); // Refrescar los datos después de eliminar
          })
          .catch(() => {
            Swal.fire("Error", "Hubo un problema al eliminar la Fecha.", "error");
          });
      }
    });
  };

  return (
    <>
      <div className="wrapper">
        <Header />
        <div className="content-wrapper">
          <div className="container">
            <section className="content-header">
              <h1>Gestión de Partidos</h1>
              <ol className="breadcrumb">
                <li>
                  <Link to={"/admin"}>
                    <i className="fa fa-dashboard" />
                    Home
                  </Link>
                </li>
                <li className="active">Partidos</li>
                <li>
                  <button
                    type="button"
                    className="btn btn-success"
                    data-toggle="modal"
                    data-target="#modal-partido"
                    onClick={() => setLoad(null)} // Nuevo partido
                  >
                    Crear Fecha
                  </button>
                </li>
              </ol>
            </section>
            <div className="box box-default" id="tabla_fecha">
              <Datatable columns={columnas} data={fechas} />
            </div>
          </div>
        </div>
        <Footer />
      </div>
      <ModalPartido id={load} />
    </>
  );
}

export default Partidos;
