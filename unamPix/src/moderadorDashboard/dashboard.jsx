import { SideBar } from "./sidebar";
import styles from "./dashboard.module.css";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faImage,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

export function Dashboard() {
  const Cards = () => {
    const [data, setData] = useState({
      numEventosCreados: 0,
      totalPublicaciones: 0,
      totalUsuarios: 0,
    });
    const [usuarios, setUsuarios] = useState([]);
    useEffect(() => {
      const fetchUser = async () => {
        try {
          const response = await axios.get("http://localhost:3001/ping");
          setUsuarios(response.data.usuarios);
        } catch (error) {
          console.error("Error al obtener los usuarios", error);
        }
      };
      fetchUser();
    }, []);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            "http://localhost:3001/eventsImage",
            {
              params: {
                idModerador: 20242010,
              },
            }
          );
          setData(response.data);
        } catch (error) {
          console.error("Error al obtener los datos", error);
        }
      };
      fetchData();
    }, []);

    return (
      <>
        <div className={styles.cardsContainer}>
          <div className={styles.Card}>
            <div className={styles.cardHeader}>
              <span>Total de Concursos</span>
              <span>
                <FontAwesomeIcon icon={faCalendar} />
              </span>
            </div>
            <div className={styles.cardContent}>
              <h1>{data.numEventosCreados}</h1>
            </div>
          </div>
          <div className={styles.Card}>
            <div className={styles.cardHeader}>
              <span>Total de Imágenes</span>
              <span>
                <FontAwesomeIcon icon={faImage} />
              </span>
            </div>
            <div className={styles.cardContent}>
              <h1>{data.totalPublicaciones}</h1>
            </div>
          </div>
          <div className={styles.Card}>
            <div className={styles.cardHeader}>
              <span>Total de Usuarios</span>
              <span>
                <FontAwesomeIcon icon={faUsers} />
              </span>
            </div>
            <div className={styles.cardContent}>
              <h1>{data.totalUsuarios}</h1>
            </div>
          </div>
          <div className={`${styles.Card} ${styles.CardTable}`}>
            <div className={styles.cardHeader}>
              <span>Usuarios Registrados</span>
            </div>
            <div className={styles.cardContent}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Nombre</th>
                    <th>Apellidos</th>
                    <th>Publicaciones</th>
                    <th>Participación de Concursos</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((user) => (
                    <tr key={user.idUsuario} className={styles.contentUser}>
                      <td data-label="Código">{user.idUsuario}</td>
                      <td data-label="Nombre">{user.Nombres}</td>
                      <td data-label="Apellidos">{user.Apellidos}</td>
                      <td data-label="Publicaciones">
                        {user.NumPublicaciones}
                      </td>
                      <td data-label="Concursos">
                        {user.NumParticipacionEventos}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className={styles.dashboardContainer}>
      <SideBar />
      <div className={styles.Content}>
        <Cards />
      </div>
    </div>
  );
}
