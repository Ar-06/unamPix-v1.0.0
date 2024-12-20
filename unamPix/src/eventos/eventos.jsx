import { useEffect, useState } from "react";
import { Navbar } from "../Home/navbar";
import styles from "./eventos.module.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { toast } from "@pheralb/toast";

export function Eventos() {
  const [eventos, setEventos] = useState([]);
  const [eventoSelect, setEventoSelect] = useState(null);
  const [verModal, setVerModal] = useState(false);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await axios.get("http://localhost:3001/events");
        setEventos(response.data.eventos);
      } catch (error) {
        console.error("Error al obtener los eventos");
      }
    };
    fetchEventos();
  }, []);

  const handleOpenModal = (evento) => {
    setEventoSelect(evento);
    setVerModal(true);
  };

  const handleCloseModal = () => {
    setVerModal(false);
    setEventoSelect(null);
  };

  const handleParticipar = async (evento) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3001/eventos/participar",
        { idEvento: evento.idEvento },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success({
          text: "Te has registrado correctamente en el concurso",
          description: "Mucha suerte ;)",
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.info({
          text: "Ya estas participando del evento",
          description: "No puedes registrarte mas de una vez",
        });
      } else {
        console.error("Error al registrarte en el evento", error);
        toast.error({
          text: "Error al registrarte en el evento",
          description: "Intenta de nuevo",
        });
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.eventosContainer}>
        <div className={styles.eventosContent}>
          <div className={styles.eventosItems}>
            {eventos.map((event) => (
              <div key={event.idEvento} className={styles.eventoCard}>
                <h2>{event.Nombre}</h2>
                <span>Inicio: {event.FechaInicio}</span>
                <span>Culmina: {event.FechaFinal}</span>
                <button
                  className={styles.btnInfo}
                  onClick={() => handleOpenModal(event)}
                >
                  Más información
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {verModal && eventoSelect && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button className={styles.closeButton} onClick={handleCloseModal}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
            <h2>{eventoSelect.Nombre}</h2>
            <p>
              <strong>Descripción:</strong> {eventoSelect.Descripcion}
            </p>
            <p>
              <strong>Fecha de Inicio:</strong> {eventoSelect.FechaInicio}
            </p>
            <p>
              <strong>Fecha de Culminación:</strong> {eventoSelect.FechaFinal}
            </p>
            <button
              className={styles.btnParticipar}
              onClick={() => handleParticipar(eventoSelect)}
            >
              Participar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
