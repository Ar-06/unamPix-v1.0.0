import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "@pheralb/toast";
import { Navbar } from "../Home/navbar";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "./categoriasImage.module.css";

export function CategoriaImage() {
  const { categoria } = useParams();
  const [imagesCategory, setImagesCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchImagesCategory = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/publicaciones/${categoria}`
        );
        setImagesCategory(response.data.publicacionCategoria);
      } catch (error) {
        console.error("Error al obtener las imagenes de la categoria: ", error);
        toast.error({ text: "Error al obtener las imágenes de la categoria" });
      } finally {
        setLoading(false);
      }
    };
    fetchImagesCategory();
  }, [categoria]);

  if (!imagesCategory) {
    return <p>No se encontraron las imágenes de esta categoria</p>;
  }

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
      console.error("ID de la publicación no esta definido");
      return;
    }
    navigate(`/publicacion/${idPublicacion}`);
  };

  return (
    <>
      <Navbar />
      <div className={styles.mainContainer}>
        <div className={styles.containerItems}>
          {loading ? (
            Array(6)
              .fill(0)
              .map((_, index) => (
                <div className={styles.card} key={index}>
                  <Skeleton height={400} />
                </div>
              ))
          ) : imagesCategory.length > 0 ? (
            imagesCategory.map((publicacion) => (
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
      </div>
    </>
  );
}
