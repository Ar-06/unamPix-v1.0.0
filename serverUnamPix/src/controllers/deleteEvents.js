const connecion = require("../models/db");

module.exports.deleteEvento = (req, res) => {
  const idEvento = req.params.idEvento;
  const { idModerador } = req.body;

  // 1. Obtener todos los usuarios que participaron en el evento
  const getUserQuery =
    "SELECT idUsuario FROM participarevento WHERE idEvento = ?";

  connecion.query(getUserQuery, [idEvento], (err, results) => {
    if (err) {
      console.error("Error al obtener los usuarios del concurso", err);
      return res
        .status(500)
        .json({ message: "Error al obtener los usuarios del concurso" });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron usuarios para el concurso" });
    }

    // 2. Eliminar el evento
    const deleteEventoQuery = "DELETE FROM evento WHERE idEvento = ?";
    connecion.query(deleteEventoQuery, [idEvento], (err) => {
      if (err) {
        console.error("Error al eliminar el concurso", err);
        return res
          .status(500)
          .json({ message: "Error al eliminar el concurso" });
      }

      const updateModQuery =
        "UPDATE moderador SET NumEventosCreados = NumEventosCreados - 1 WHERE idModerador = ?";
      connecion.query(updateModQuery, [idModerador], (err) => {
        if (err) {
          console.error(
            "Error al actualizar el numero de eventos creados por el moderador"
          );
          return res.status(500).json({
            message:
              "Error al actualizar el numero de eventos creados por el moderador",
          });
        }
        // 3. Actualizar las participaciones de todos los usuarios
        const updateEventUser =
          "UPDATE usuario SET NumParticipacionEventos = NumParticipacionEventos - 1 WHERE idUsuario = ?";

        results.forEach((user) => {
          connecion.query(updateEventUser, [user.idUsuario], (err) => {
            if (err) {
              console.error(
                "Error al actualizar el número de participaciones del usuario",
                err
              );
            }
          });
        });
      });

      // 4. Enviar la respuesta
      res.status(200).json({ message: "Concurso eliminado correctamente" });
    });
  });
};
