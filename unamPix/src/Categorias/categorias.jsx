import { useEffect, useState } from "react";
import { Navbar } from "../Home/navbar";
import axios from "axios";
import imageEventos from "../public/assets/imageEventos.svg";
import imageEstudiantes from "../public/assets/imageEstudiantes.svg";
import imageUniversidad from "../public/assets/imageUniversidad.jpg";
import { useNavigate } from "react-router-dom";
import styles from "./categorias.module.css";

const categoriaImagenes = {
  Eventos: imageEventos,
  Universidad: imageUniversidad,
  Estudiantes: imageEstudiantes,
};

export function Categorias() {
  const [categoria, setCategoria] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get("http://localhost:3001/categorias");
        setCategoria(response.data.categorias);
      } catch (error) {
        console.error("Error al obtener las categorias", error);
      }
    };
    fetchCategorias();
  }, []);

  const handleCategoryClick = (categoria) => {
    if (!categoria) {
      console.error("Categoria de las publicaciones no definida");
      return;
    }
    navigate(`/publicaciones/${categoria}`);
  };

  return (
    <>
      <Navbar />
      <div className={styles.containerCategory}>
        {categoria.map((cat, index) => (
          <button
            className={styles.buttonCategory}
            key={index}
            onClick={() => handleCategoryClick(cat.Categoria)}
          >
            <img
              src={categoriaImagenes[cat.Categoria]}
              alt={cat.Categoria}
              className={styles.categoryImage}
            />
            <span>{cat.Categoria}</span>
          </button>
        ))}
      </div>
    </>
  );
}
