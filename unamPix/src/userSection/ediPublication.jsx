import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "@pheralb/toast";
import styles from "./editPublication.module.css";
import { Navbar } from "../Home/navbar";

export function EditPublication() {
  const { idPublicacion } = useParams();
  const navigate = useNavigate();

  const [publicacionTitle, setPublicacionTitle] = useState("");
  const [publicacionDescription, setPublicacionDescription] = useState("");
  const [publicacionCategoria, setPublicationCategoria] = useState("");
  const [publicacionTags, setPublicationTags] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (idPublicacion) {
        try {
          const token = sessionStorage.getItem("token");

          const [publicacionResponse, etiquetasResponse] = await Promise.all([
            axios.get(`http://localhost:3001/publicacion/${idPublicacion}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`http://localhost:3001/etiquetas/${idPublicacion}`),
          ]);

          // Cargar los datos de la publicación
          const publicacion = publicacionResponse.data.publication;
          setPublicacionTitle(publicacion.Titulo);
          setPublicacionDescription(publicacion.Descripcion);
          setPublicationCategoria(publicacion.Categoria);

          // Cargar las etiquetas
          const etiquetas = etiquetasResponse.data.etiquetas
            .map((etiqueta) => etiqueta.trim())
            .filter((etiqueta) => etiqueta.startsWith("#"));
          setPublicationTags(etiquetas.join(" "));
        } catch (error) {
          console.error("Error al cargar la información:", error);
        }
      }
    };

    fetchData();
  }, [idPublicacion]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem("token");

      // Convierte las etiquetas en un arreglo antes de enviarlas
      const etiquetasArray = publicacionTags
        .split(" ")
        .map((etiqueta) => etiqueta.trim())
        .filter((etiqueta) => etiqueta.startsWith("#"));

      await axios.put(
        `http://localhost:3001/updatePublication/${idPublicacion}`,
        {
          titulo: publicacionTitle,
          descripcion: publicacionDescription,
          categoria: publicacionCategoria,
          etiquetas: JSON.stringify(etiquetasArray), // Asegúrate de enviar un JSON
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success({ text: "Publicación actualizada con éxito" });
      navigate("/usuario/perfil");
    } catch (error) {
      console.error("Error al actualizar la publicación", error);
      toast.error({ text: "Error al actualizar la publicación" });
    }
  };

  const handleEtiquetasChange = (e) => {
    const newEtiquetas = e.target.value;
    if (newEtiquetas.split(" ").length <= 3) {
      setPublicationTags(newEtiquetas);
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.ediContainer}>
        <div className={styles.ediContainerItems}>
          <div className={styles.ediTitle}>
            <h2>Editar Publicación</h2>
          </div>
          <form onSubmit={handleSubmit} className={styles.uploadForm}>
            <div className={styles.formGroup}>
              <label htmlFor="title">Título</label>
              <input
                type="text"
                placeholder="Agrega un título"
                value={publicacionTitle}
                onChange={(e) => setPublicacionTitle(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description">Descripción</label>
              <textarea
                placeholder="Agrega una descripción detallada"
                value={publicacionDescription}
                onChange={(e) => setPublicacionDescription(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="categoria">Categoría</label>
              <input
                type="text"
                name="categoria"
                value={publicacionCategoria}
                onChange={(e) => setPublicationCategoria(e.target.value)}
                placeholder="Añade una categoría"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="etiquetas">Etiquetas</label>
              <input
                type="text"
                placeholder="Agrega etiquetas separadas por espacios, ej: #etiqueta1 #etiqueta2"
                value={publicacionTags}
                onChange={handleEtiquetasChange}
                required
              />
            </div>
            <button type="submit" className={styles.submitButton}>
              Actualizar Publicación
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
