import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import styles from "./moderadorLogin.module.css";
import { toast } from "@pheralb/toast";
import axios from "axios";

export function LoginModerador() {
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
      const response = await axios.post("http://localhost:3001/loginMod", {
        idModerador: codigo,
        contraseña,
      });

      if (response.status === 200) {
        toast.success({
          text: "Inicio de sesión exitoso 👌",
          description: "Bienvenido Moderador ;)",
        });
        navigate("/dashboard");
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
            <p> Moderador</p>
            <div className={styles.formGroup}>
              <input
                value={codigo}
                name="idModerador"
                onChange={(e) => setCodigo(e.target.value)}
                type="text"
                placeholder="Código"
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
          </form>
        </main>
      </div>
    </section>
  );
}
