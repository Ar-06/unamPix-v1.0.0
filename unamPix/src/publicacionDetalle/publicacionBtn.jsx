import styles from "./publicacionBtn.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faCircleDown, faShareNodes } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export function PublicacionBtn() {
  const { idPublicacion } = useParams();
  const [count, setCount] = useState(0);
  const [like, setLike] = useState(false);

  const handleLike = async (e) => {
    e.preventDefault();
    const action = like ? "dislike" : "like";
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:3001/like/${idPublicacion}`,
        { action },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200 && response.data) {
        setCount((prevCount) => (like ? prevCount - 1 : prevCount + 1));
        setLike(!like);
      }
    } catch (error) {
      console.error("Error al actualizar el like", error);
    }
  };

  const handleDownload = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `http://localhost:3001/${idPublicacion}/images`,
        {
          responseType: "blob",
        }
      );
      const URL = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = URL;
      link.setAttribute("download", "imagen_publicacion.jpg");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error al descargar la imágen:", error);
    }
  };

  const handleShare = async (e) => {
    e.preventDefault;
    const shareData = {
      title: "Publicación",
      text: "¡Mira esta publicación!",
      url: `${window.location.origin}/publicacion/${idPublicacion}`,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        console.log("¡Compartido exitosamente!");
      } else {
        console.log(
          "La función de compartir no es compatible con tu navegador"
        );
      }
    } catch (error) {
      console.error("Error al compartir", error);
    }
  };

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const likesResponse = await axios.get(
          `http://localhost:3001/publicacion/${idPublicacion}/likes`
        );
        const userLikesResponse = await axios.get(
          `http://localhost:3001/like/${idPublicacion}/check`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCount(likesResponse.data.likes);
        setLike(userLikesResponse.data.liked);
      } catch (error) {
        console.error("Error al obtener los likes", error);
      }
    };

    fetchLikes();
  }, [idPublicacion]);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.containerButtons}>
        <button
          className={styles.buttonLike}
          onClick={handleLike}
          title="reaccionar"
          aria-label="reaccionar"
          type="button"
        >
          <FontAwesomeIcon icon={like ? faHeart : faHeartRegular} />
        </button>
        <span className={styles.contador}>{count}</span>
        <button
          className={styles.buttonDownload}
          onClick={handleDownload}
          type="button"
          title="descargar"
          aria-label="descargar"
        >
          <FontAwesomeIcon icon={faCircleDown} />
        </button>
        <button
          className={styles.buttonShare}
          onClick={handleShare}
          type="button"
          title="compartir"
          aria-label="compartir"
        >
          <FontAwesomeIcon icon={faShareNodes} />
        </button>
      </div>
    </div>
  );
}
