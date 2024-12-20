import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import styles from "./chatComentario.module.css";

const TOKEN = sessionStorage.getItem("token");
const socket = io("http://localhost:3001", {
  auth: { token: TOKEN },
  forceNew: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export function ChatComentario({ idPublicacion }) {
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [comentarios, setComentarios] = useState([]);
  const messageEndRef = useRef(null);

  const scrollToBottom = () => {
    messageEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [comentarios]);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      // Unirse al room de la imagen
      socket.emit("joinImageRoom", { idPublicacion });
    }
  }, [idPublicacion]);

  useEffect(() => {
    // Escuchar mensajes solo para esta publicación
    socket.on("receiveComment", (comentario) => {
      if (comentario.idPublicacion === idPublicacion) {
        setComentarios((prevComentarios) => [...prevComentarios, comentario]);
      }
    });

    return () => {
      socket.off("receiveComment");
    };
  }, [idPublicacion]);

  const handleEnviarComentario = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("token");

    try {
      const response = await axios.post("http://localhost:3001/comentarios", {
        token,
        idPublicacion,
        comentario: nuevoComentario,
      });

      if (response.status === 201 && response.data) {
        console.log("Comentario guardado con éxito", response.data);
        socket.emit("sendComment", {
          token,
          idPublicacion,
          comentario: nuevoComentario,
        });
      } else {
        console.error("Respuesta inesperada del servidor", response.data);
      }
      setNuevoComentario("");
    } catch (error) {
      console.error(
        "Error al enviar el comentario",
        error.response.data || error.message
      );
    }
  };

  useEffect(() => {
    const fetchComentarios = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/comentarios/${idPublicacion}`
        );
        setComentarios(response.data.comentarios);
      } catch (error) {
        console.error(error);
      }
    };
    fetchComentarios();
  }, [idPublicacion]);


  return (
    <div className={styles.chatContainer}>
      <div className={styles.messagesContainer}>
        {comentarios.length > 0 ? (
          comentarios.map((comentario, index) => (
            <div key={index} className={styles.message}>
              <strong>{comentario.userName}:</strong> {comentario.comentario}
            </div>
          ))
        ) : (
          <p className={styles.textNone}>No hay comentarios</p>
        )}
        <div ref={messageEndRef} />
      </div>
      <form onSubmit={handleEnviarComentario}>
        <div className={styles.formGroup}>
          <input
            type="text"
            className={styles.inputMessage}
            name="comentario"
            placeholder="Agrega un comentario"
            value={nuevoComentario}
            onChange={(e) => setNuevoComentario(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <button type="submit" className={styles.buttonSend}>
            <svg
              className="Hn_ AR6 gUZ U9O kVc"
              height="24"
              role="img"
              viewBox="0 0 24 24"
              width="24"
            >
              <path
                d="m.46 2.43-.03.03c-.4.42-.58 1.06-.28 1.68L3 10.5 16 12 3 13.5.15 19.86c-.3.62-.13 1.26.27 1.67l.05.05c.4.38 1 .56 1.62.3l20.99-8.5q.28-.12.47-.3l.04-.04c.68-.71.51-2-.51-2.42L2.09 2.12Q1.79 2 1.49 2q-.61.01-1.03.43"
                fill="white"
              ></path>
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
