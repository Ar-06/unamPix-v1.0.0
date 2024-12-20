import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./publicaciones.module.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export function Publicaciones() {
  const [verPublicacion, setVerPublicacion] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPublicacion = async () => {
      try {
        const response = await axios.get("http://localhost:3001/publications");
        setVerPublicacion(response.data);
      } catch (error) {
        console.error("Error al obtener las publicaciones", error);
      } finally {
        setLoading(false)
      }
    };
    fetchPublicacion();
  }, []);

  const handleImageLoad = (e, id) => {
    const { naturalWidth, naturalHeight } = e.target;
    const card = document.querySelector(`#card-${id}`);

    if (naturalWidth > naturalHeight) {
      card.classList.add(styles.horizontal);
      card.classList.remove(styles.vertical);
    } else {
      card.classList.add(styles.vertical);
      card.classList.remove(styles.horizontal);
    }
  };

  const handleImageClick = (idPublicacion) => {
    if (!idPublicacion) {
      console.error("ID de la publicación no está definido");
      return;
    }
    navigate(`/publicacion/${idPublicacion}`);
  };

  return (
    <main className={styles.mainContainer}>
      <div className={styles.containerItems}>
        {loading ? (
          Array(6)
            .fill(0)
            .map((_, index) => (
              <div className={styles.card} key={index}>
                <Skeleton height={400} />
              </div>
            ))
        ) : verPublicacion.length > 0 ? (
          verPublicacion.map((publicacion) => (
            <div
              id={`card-${publicacion.idPublicacion}`}
              className={`${styles.card}`}
              key={publicacion.idPublicacion}
            >
              <img
                src={`http://localhost:3001/images/${publicacion.URL}`}
                alt="Publicación"
                className={styles.image}
                onLoad={(e) => handleImageLoad(e, publicacion.idPublicacion)}
                onClick={() => handleImageClick(publicacion.idPublicacion)}
              />
            </div>
          ))
        ) : (
          <p className={styles.message}>No hay publicaciones disponibles</p>
        )}
      </div>
    </main>
  );
}
