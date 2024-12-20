import { SideBar } from "./sidebar";
import styles from "./dashboardImages.module.css";
import { useEffect, useState } from "react";
import { toast } from "@pheralb/toast";
import Swal from "sweetalert2";
import axios from "axios";

export function DashboardImages() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get("http://localhost:3001/publications");
        setImages(response.data);
      } catch (error) {
        console.error("Error al obtener las imagenes");
      }
    };

    fetchImages();
  }, []);

  const handleDeleteImage = async (idPublicacion) => {
    const idModerador = 20242010;

    try {
      const result = await Swal.fire({
        title: "¿Estás seguro de eliminar esta imagen?",
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "¡Sí, bórrala!",
      });

      if (result.isConfirmed) {
        const response = await axios.delete(
          `http://localhost:3001/deletePublication/${idPublicacion}`,
          {
            data: { idModerador },
          }
        );

        if (response.status === 200) {
          // Mostrar el mensaje de éxito
          Swal.fire({
            title: "Eliminado!",
            text: "La imagen ha sido eliminada correctamente.",
            icon: "success",
          });

          setImages(
            images.filter((img) => img.idPublicacion !== idPublicacion)
          );
        }
      }
    } catch (error) {
      console.error("Error al eliminar la imagen", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al eliminar la imagen. Intenta de nuevo.",
      });
    }
  };

  const CardImage = () => {
    return (
      <div className={styles.ImageContainer}>
        <section className={styles.ImagesContent}>
          <div className={styles.ImageHeader}>
            <h2>Imágenes existentes</h2>
          </div>
          <div className={styles.Images}>
            {images.map((img) => (
              <div key={img.idPublicacion}>
                <img
                  src={`http://localhost:3001/images/${img.URL}`}
                  alt="Publicacion"
                  className={styles.image}
                />

                <button
                  className={styles.btnDelete}
                  onClick={() => handleDeleteImage(img.idPublicacion)}
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  };

  return (
    <div className={styles.DashboardContainerImages}>
      <SideBar />
      <div className={styles.DashboardImages}>
        <CardImage />
      </div>
    </div>
  );
}
