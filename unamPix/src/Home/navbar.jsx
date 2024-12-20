import logo from "../public/assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { decodeJwt } from "../Main/decodeJWT";
import { toast } from "@pheralb/toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./navbar.module.css";
import { useEffect, useState } from "react";
import { faRightFromBracket, faUser } from "@fortawesome/free-solid-svg-icons";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons/faCirclePlus";

export function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nombre, setNombre] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const token = sessionStorage.getItem("token");
      if (token) {
        const decodedToken = decodeJwt(token);
        if (decodedToken) {
          setIsLoggedIn(true);
          setNombre(decodedToken.nombre);
        }
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }, []);

  const getInitials = (name) => {
    const names = name.split(" ");
    return names.map((n) => n[0].toUpperCase()).join("");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    setIsLoggedIn(false);
    toast.success({
      text: "Has cerrado sesión",
      description: "Vuelve pronto ;)",
    });
    navigate("/");
  };

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.navbarLogo}>
          <img src={logo} alt="logo" className={styles.logoImg} />
          <h2>UnamPix</h2>
        </div>
        <ul className={styles.navbarMenu}>
          <Link to="/">
            <li>Inicio</li>
          </Link>
          <Link to="/categorias">
            <li>Categorías</li>
          </Link>
          <Link to="/eventos">
            <li>Concursos</li>
          </Link>
        </ul>

        <div className={styles.navbarButtons}>
          {isLoggedIn ? (
            <>
              <span>Bienvenido(a)</span>
              <Link to="/usuario/perfil">
                <button
                  title="Perfil"
                  arial-label="Perfil"
                  className={styles.btnPerfil}
                >
                  {nombre ? (
                    <div className={styles.profileIcon}>
                      {getInitials(nombre)}
                    </div>
                  ) : (
                    <FontAwesomeIcon
                      icon={faUser}
                      size="2x"
                      style={{ color: "white" }}
                    />
                  )}
                </button>
              </Link>
              <Link to="/addImage">
                <button
                  title="Añade una imágen"
                  aria-label="Añade una imágen"
                  className={styles.btnAdd}
                >
                  <FontAwesomeIcon
                    icon={faCirclePlus}
                    size="2x"
                    style={{ color: "white" }}
                  />
                </button>
              </Link>

              <button
                title="Cerrar Sesión"
                className={styles.btnLogout}
                aria-label="Cerrar Sesión"
                onClick={handleLogout}
              >
                <FontAwesomeIcon
                  icon={faRightFromBracket}
                  size="2x"
                  style={{ color: "white" }}
                />
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className={styles.loginButton}>Iniciar sesión</button>
              </Link>
              <Link to="/register">
                <button className={styles.registerButton}>Registrarse</button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
}
