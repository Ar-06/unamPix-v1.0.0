import styles from "./sidebar.module.css";
import logo from "../public/assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faCalendar,
  faImage,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "@pheralb/toast";

export function SideBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn(false);
    toast.success({
      text: "Has cerrado sesión",
      description: "Vuelve pronto ;)",
    });

    navigate("/loginMod");
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <img src={logo} alt="logo" className={styles.logoImg} />
        <span className={styles.sidebarTitle}>UnamPix</span>
      </div>
      <nav className={styles.sidebarNav}>
        <ul>
          <Link to="/dashboard" className={styles.navLink}>
            <li>
              <FontAwesomeIcon icon={faHouse} /> <span>Inicio</span>
            </li>
          </Link>
          <Link to="/dashboard/events" className={styles.navLink}>
            <li>
              <FontAwesomeIcon icon={faCalendar} /> <span>Concursos</span>
            </li>
          </Link>
          <Link to="/dashboard/images" className={styles.navLink}>
            <li>
              <FontAwesomeIcon icon={faImage} /> <span>Imágenes</span>
            </li>
          </Link>
          <button className={styles.logoutButton}>
            <li onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} /> <span>Cerrar sesión</span>
            </li>
          </button>
        </ul>
      </nav>
    </div>
  );
}
