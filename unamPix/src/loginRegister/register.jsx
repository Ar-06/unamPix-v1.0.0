import { Link } from "react-router-dom";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "@pheralb/toast";
import { useNavigate } from "react-router-dom";
import styles from "./register.module.css";
import axios from "axios";

export function Register() {
  const [codigo, setCodigo] = useState("");
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/register", {
        idUsuario: codigo,
        nombres,
        apellidos,
        contraseña,
      });

      if (response.data.message === "Usuario registrado exitosamente") {
        toast.success({
          text: "Te has registrado correctamente 🎉",
          description: "Inicia Sesión",
        });
        setCodigo("");
        setNombres("");
        setApellidos("");
        setContraseña("");
        navigate("/login");
      }
    } catch (error) {
      toast.error({
        text: "Error al registrar usuario 😥",
        description: "Intentelo de nuevo",
      });
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <section className={styles.registerContainer}>
      <div className={styles.registerContent}>
        <header className={styles.registerHeader}>
          <h1>UnamPix</h1>
          <p>Únete a nuestra comunidad de imágenes</p>
        </header>
        <main>
          <form onSubmit={handleRegister} className={styles.registerForm}>
            <h2>Crear una cuenta</h2>
            <div className={styles.formGroup}>
              <input
                name="idUsuario"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                type="text"
                placeholder="Código Universitario"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <input
                name="nombres"
                value={nombres}
                onChange={(e) => setNombres(e.target.value)}
                type="text"
                placeholder="Nombres"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <input
                name="apellidos"
                value={apellidos}
                onChange={(e) => setApellidos(e.target.value)}
                type="text"
                placeholder="Apellidos"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <input
                type={showPassword ? "text" : "password"}
                name="contraseña"
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                placeholder="Crea una contraseña"
                required
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className={styles.showPasswordButton}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            <button type="submit" className={styles.submitBtn}>
              Registrarse
            </button>
            <p className={styles.loginLink}>
              ¿Ya eres miembro? <Link to="/login">Iniciar Sesión</Link>
            </p>
          </form>
        </main>
      </div>
    </section>
  );
}
