import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./userPublication.module.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { decodeJwt } from "../Main/decodeJWT";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export function UserPublication() {
  const [userPublication, setUserPublication] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nombre, setNombre] = useState("");
  const [verModal, setVerModal] = useState(false);
  const [imagenSelect, setImagenSelect] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPublicaciones = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (token) {
          const decodedToken = decodeJwt(token);
          if (decodedToken) {
            setNombre(decodedToken.nombre);
          }
        }
        const response = await axios.get(
          "http://localhost:3001/usuario/publicaciones",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.publications) {
          setUserPublication(response.data.publications);
        } else {
          setUserPublication([]);
        }
      } catch (error) {
        console.error("Error al obtener las publicaciones del usuario", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicaciones();
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

  const handleOpenModal = (imagen) => {
    setImagenSelect(imagen);
    setVerModal(true);
  };

  const handleCloseModal = () => {
    setVerModal(false);
    setImagenSelect(null);
  };

  const handleEditClick = (publicacion) => {
    if (!publicacion.idPublicacion) {
      console.error("El id de la publicación es inválido:", publicacion);
      return;
    }
    navigate(`/edit-publication/${publicacion.idPublicacion}`);
  };

  const handleDeletePublication = async (publicacion) => {
    try {
      const token = sessionStorage.getItem("token");

      const result = await Swal.fire({
        title: "¿Estás seguro de eliminar la imagen?",
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "¡Sí, bórralo!",
      });

      if (result.isConfirmed) {
        const response = await axios.delete(
          `http://localhost:3001/deletePublication/${publicacion.idPublicacion}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          Swal.fire({
            title: "Eliminado!",
            text: "Tu imagen ha sido eliminada.",
            icon: "success",
          });

          setUserPublication(
            userPublication.filter(
              (img) => img.idPublicacion !== publicacion.idPublicacion
            )
          );
          navigate("/usuario/perfil");
          setVerModal(false);
        }
      }
    } catch (error) {
      console.error("Error al eliminar la publicación", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al eliminar la publicación. Intenta de nuevo.",
      });
    }
  };

  return (
    <main className={styles.mainContainer}>
      <div className={styles.containerItems}>
        <div className={styles.userSection}>
          <div className={styles.userInfo}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
            <h3>{nombre}</h3>
          </div>

          <h2 className={styles.title}>Imágenes Publicadas</h2>
        </div>

        <div className={styles.imagesSection}>
          <div className={styles.imagesContainer}>
            {loading ? (
              Array(6)
                .fill(0)
                .map((_, index) => (
                  <div className={styles.card} key={index}>
                    <Skeleton height={400} />
                  </div>
                ))
            ) : userPublication.length > 0 ? (
              userPublication.map((publicacion) => (
                <div
                  id={`card-${publicacion.idPublicacion}`}
                  className={`${styles.card}`}
                  key={publicacion.idPublicacion}
                >
                  <img
                    src={`http://localhost:3001/images/${publicacion.URL}`}
                    alt="Publicación"
                    className={styles.image}
                    onLoad={(e) =>
                      handleImageLoad(e, publicacion.idPublicacion)
                    }
                    onClick={() => handleOpenModal(publicacion)}
                  />
                </div>
              ))
            ) : (
              <p className={styles.message}>
                No tienes publicaciones disponibles
              </p>
            )}
          </div>
        </div>
      </div>
      {verModal && imagenSelect && (
        <div
          className={`${styles.modalOverlay} ${verModal ? styles.active : ""}`}
        >
          <div className={styles.modalContent}>
            <button className={styles.closeButton} onClick={handleCloseModal}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
            <img
              src={`http://localhost:3001/images/${imagenSelect.URL}`}
              alt="imagen"
              className={styles.modalImage}
            />
            <div className={styles.buttonContainer}>
              <button
                className={styles.btnEditar}
                onClick={() => handleEditClick(imagenSelect)}
              >
                Editar
              </button>
              <button
                className={styles.btnEliminar}
                onClick={() => handleDeletePublication(imagenSelect)}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
