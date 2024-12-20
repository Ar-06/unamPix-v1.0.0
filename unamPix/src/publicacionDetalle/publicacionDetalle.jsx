import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "@pheralb/toast";
import { Navbar } from "../Home/navbar";
import { PublicacionBtn } from "./publicacionBtn";
import { ChatComentario } from "../Comentarios/chatComentarios";
import styles from "./publicacionDetalle.module.css";
import axios from "axios";

export function PublicacionDetalle() {
  const { idPublicacion } = useParams();
  const [publicacion, setPublicacion] = useState(null);
  const [etiquetas, setEtiquetas] = useState([]);

  useEffect(() => {
    const fetchPublicacion = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/publicacion/${idPublicacion}`
        );
        setPublicacion(response.data.publication);
      } catch (error) {
        toast.error({ text: "Error al obtener la publicación" });
      }
    };

    fetchPublicacion();
  }, [idPublicacion]);
  
  useEffect(() => {
    const fetchEtiquetas = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/etiquetas/${idPublicacion}`
        );
        setEtiquetas(response.data.etiquetas);
      } catch (error) {
        console.error(error);
      }
    };
    fetchEtiquetas();
  }, [idPublicacion]);


  if (!publicacion) {
    return <p>No se encontró la publicación</p>;
  }

  return (
    <>
      <Navbar />
      <div className={styles.cardContainer}>
        <div className={styles.card}>
          <img
            className={styles.cardImage}
            src={`http://localhost:3001/images/${publicacion.URL}`}
            alt={publicacion.Titulo}
          />
          <div className={styles.cardContent}>
            <PublicacionBtn />
            <h1 className={styles.titleCard}>{publicacion.Titulo}</h1>
            <p className={styles.descriptionCard}>{publicacion.Descripcion}</p>
            <div className={styles.etiquetaContainer}>
              {etiquetas.map((etiqueta, i) =>(
                <div key={i} className={styles.etiquetaContent}> 
                  <span className={styles.textEtiqueta}>{etiqueta}</span>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.cardComments}>
            <ChatComentario idPublicacion={idPublicacion} />
          </div>
        </div>
      </div>
    </>
  );
}
