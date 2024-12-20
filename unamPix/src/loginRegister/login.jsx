import { useState } from "react";
import axios from "axios";
import { toast } from "@pheralb/toast";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import styles from "./login.module.css";

export function Login() {
  const [codigo, setCodigo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/login", {
        idUsuario: codigo,
        contraseña,
      });

      if (response.data.token) {
        sessionStorage.setItem("token", response.data.token);

        toast.success({
          text: "Inicio de sesión exitoso 👌",
          description: "Bienvenido ;)",
        });
        navigate("/");
      } else {
        toast.error({
          text: "Usuario o contraseña incorrectos 😥",
          description: "Intenta de nuevo :(",
        });
      }
    } catch (error) {
      toast.error({
        text: "Error al iniciar sesión 🫠",
        description: "Intentalo de nuevo",
      });
    }
  };

  return (
    <section className={styles.loginContainer}>
      <div className={styles.loginContent}>
        <header className={styles.loginHeader}>
          <h1>UnamPix</h1>
          <p>Tu galería de imágenes universitarias</p>
        </header>
        <main>
          <form onSubmit={handleLogin} className={styles.loginForm}>
            <p>Encuentra y guarda las mejores imágenes de la UNAM</p>
            <div className={styles.formGroup}>
              <input
                value={codigo}
                name="idUsuario"
                onChange={(e) => setCodigo(e.target.value)}
                type="text"
                placeholder="Código Universitario"
              />
            </div>
            <div className={styles.formGroup}>
              <input
                type={showPassword ? "text" : "password"}
                name="contraseña"
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                placeholder="Contraseña"
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
              Iniciar Sesión
            </button>
            <p className={styles.registerLink}>
              ¿No tienes una cuenta? <Link to="/register">Registrate aquí</Link>
            </p>
          </form>
        </main>
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            right: "10px",
            fontSize: "12px",
          }}
        >
          <Link
            to="/loginMod"
            style={{ color: "#333", textDecoration: "none" }}
          >
            Acceso para moderadores
          </Link>
        </div>
      </div>
    </section>
  );
}
