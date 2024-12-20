import { useState } from "react";
import { Navbar } from "../Home/navbar";
import styles from "./subirImagen.module.css";
import { toast } from "@pheralb/toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function SubirImagen() {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [etiquetas, setEtiquetas] = useState("");
  const [categoria, setCategoria] = useState("");
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];

      const validImageTypes = ["image/jpeg", "image/png", "image/webp"];
      if (validImageTypes.includes(file.type)) {
        handleFile(file);
      } else {
        toast.error({
          text: "Por favor, seleccione una imagen válida (JPG, PNG, WEBP)",
          description: "Intenta nuevamente",
        });
      }
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const validImageTypes = ["image/jpeg", "image/png", "image/webp"];
      if (validImageTypes.includes(file.type)) {
        handleFile(file);
      } else {
        toast.error({
          text: "Por favor, seleccione una imagen válida (JPG, PNG, WEBP)",
          description: "Intenta nuevamente",
        });
      }
    }
  };

  const handleFile = (file) => {
    setFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleClick = () => {
    document.getElementById("fileInput").click();
  };

  const handleEtiquetasChange = (e) => {
    const newEtiquetas = e.target.value;
    if (newEtiquetas.split(",").length <= 3) {
      setEtiquetas(newEtiquetas);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("descripcion", descripcion);
    formData.append("categoria", categoria);
    const etiquetasArray = etiquetas
      .split(" ")
      .map((etiqueta) => etiqueta.trim())
      .filter((etiqueta) => etiqueta.startsWith("#"));
    formData.append("etiquetas", JSON.stringify(etiquetasArray));
    if (file) {
      formData.append("image", file);
    }

    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3001/publication",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (
        response &&
        response.data.message === "Publicación creada correctamente"
      ) {
        toast.success({ text: "Publicación creada 🎉" });
        setTitulo("");
        setDescripcion("");
        setCategoria("");
        setEtiquetas("");
        setFile(null);
        navigate("/");
      } else {
        throw new Error("Respuesta inesperada del servidor");
      }
    } catch (error) {
      console.error("Error al realizar su publicación");
      toast.error({
        text: "No se pudo realizar su publicación 😥",
        description: "Intente nuevamente",
      });
    }
  };

  return (
    <div>
      <div className={styles.navbar}>
        <Navbar />
      </div>
      <main className={styles.fileUploadContainer}>
        <form className={styles.uploadForm} onSubmit={handleSubmit}>
          <div
            className={`${styles.dropZone} ${
              isDragging ? styles.dragging : ""
            }`}
            onDragEnter={handleDragIn}
            onDragLeave={handleDragOut}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={handleClick}
          >
            <input
              type="file"
              id="fileInput"
              accept=".jpg,.png"
              onChange={handleFileSelect}
              className={styles.fileInput}
            />
            {preview ? (
              <img
                src={preview}
                alt="vista previa"
                className={styles.previewImage}
              />
            ) : (
              <>
                <div className={styles.uploadIcon}>
                  <svg
                    aria-label="Agregar archivos"
                    className="bW6 gUZ U9O kVc"
                    height="32"
                    role="img"
                    viewBox="0 0 24 24"
                    width="32"
                  >
                    <path d="M24 12a12 12 0 1 0-24 0 12 12 0 0 0 24 0m-10.77 3.75a1.25 1.25 0 0 1-2.5 0V11.8L9.7 12.83a1.25 1.25 0 0 1-1.77-1.77L12 7l4.07 4.06a1.25 1.25 0 0 1-1.77 1.77l-1.07-1.06z"></path>
                  </svg>
                </div>
                <p className={styles.uploadText}>
                  Elige un archivo o arrástralo y colócalo aquí
                </p>
                <p className={styles.uploadDescription}>
                  Puedes seleccionar archivos .jpg o .png o .webp
                </p>
              </>
            )}

            {file && (
              <p className={styles.fileSelected}>
                Archivo seleccionado: {file.name}
              </p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="title">Título</label>
            <input
              type="text"
              placeholder="Agrega un título"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              disabled={!file}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Descripción</label>
            <textarea
              placeholder="Agrega una descripción detallada"
              disabled={!file}
              onChange={(e) => setDescripcion(e.target.value)}
              value={descripcion}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="categoria">Categoría</label>
            <input
              type="text"
              name="categoria"
              disabled={!file}
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              placeholder="Añade una categoría"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="etiquetas">Etiquetas</label>
            <input
              type="text"
              placeholder="Agrega etiquetas separadas por espacios, ej: #etiqueta1 #etiqueta2"
              disabled={!file}
              onChange={handleEtiquetasChange}
              value={etiquetas}
            />
          </div>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={!file}
          >
            Publicar
          </button>
        </form>
      </main>
    </div>
  );
}
