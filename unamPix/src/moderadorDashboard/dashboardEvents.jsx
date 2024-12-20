import { SideBar } from "./sidebar";
import styles from "./dashboardEvents.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "@pheralb/toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export function DashboardEvents() {
  const [nombre, setNombre] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFinal, setFechaFinal] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:3001/events");
        setEventos(response.data.eventos);
      } catch (error) {
        console.error("Error al obtener los eventos");
      }
    };
    fetchEvents();
  }, []);

  const handleSubmitEvent = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/createEvent", {
        idModerador: 20242010,
        nombre,
        fechaInicio,
        fechaFinal,
        descripcion,
      });
      if (response.data.message === "Evento creado correctamente") {
        toast.success({ text: "Evento creado correctamente 🎉" });
        setNombre("");
        setFechaInicio("");
        setFechaFinal("");
        setDescripcion("");
      }
    } catch (error) {
      console.log(error);
      toast.error({
        text: "Error al registrar el evento 😥",
        description: "Intentelo de nuevo",
      });
    }
  };

  const handleDelete = async (idEvento) => {
    const idModerador = 20242010;
    try {
      await axios.delete(`http://localhost:3001/deleteConcurso/${idEvento}`, {
        data: { idModerador },
      });

      toast.success({ text: "Concurso eliminado correctamente" });
      setEventos(eventos.filter((event) => event.idEvento !== idEvento));
    } catch (error) {
      console.error("Error al eliminar el concurso", error);
      toast.error({
        text: "Error al eliminar el concurso",
        description: "Intente de nuevo",
      });
    }
  };

  const CardEvent = () => {
    return (
      <div className={styles.EventContainer}>
        <section className={styles.EventContent}>
          <div className={styles.EventHeader}>
            <h2>Concursos existentes</h2>
          </div>
          {eventos.map((event, index) => (
            <div key={index} className={styles.eventDetalle}>
              <p>{event.Nombre}</p>
              <span>{event.FechaInicio}</span>
              <button
                className={styles.btnDelete}
                onClick={() => handleDelete(event.idEvento)}
              >
                <FontAwesomeIcon icon={faTrash} size="2x" />
              </button>
            </div>
          ))}
        </section>
      </div>
    );
  };

  return (
    <div className={styles.dashboardContainerEvents}>
      <SideBar />
      <div className={styles.dashboardEvents}>
        <section className={styles.registerEventContainer}>
          <div className={styles.registerEventContent}>
            <main>
              <form
                onSubmit={handleSubmitEvent}
                className={styles.formRegisterEvent}
              >
                <h2>Crear un Nuevo Concurso</h2>
                <div className={styles.formGroup}>
                  <label htmlFor="name">Nombre del Concurso</label>
                  <input
                    type="text"
                    name="nombre"
                    id="nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="dateInicio">Fecha de Inicio</label>
                  <input
                    type="date"
                    name="fechaInicio"
                    id="fechaInicio"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="dateFin">Fecha Final</label>
                  <input
                    type="date"
                    name="fechaFinal"
                    id="fechaFinal"
                    value={fechaFinal}
                    onChange={(e) => setFechaFinal(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="">Descripción</label>
                  <textarea
                    name="description"
                    id="description"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                  />
                </div>
                <button type="submit" className={styles.submitBtn}>
                  Crear Concurso
                </button>
              </form>
            </main>
          </div>
        </section>
        <CardEvent />
      </div>
    </div>
  );
}
