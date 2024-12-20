const connection = require("../models/db");

module.exports.getComments = (req, res) => {
  const { idPublicacion } = req.params;

  if (!idPublicacion) {
    console.error("Falta el id de la publicacion");
    return res.status(400).json({ message: "Falta el id de la publicacion" });
  }

  const getCommentsquery =
    "SELECT comentario.idComentario, usuario.Nombres AS userName, comentario.Texto AS comentario, comentario.fecha FROM comentario JOIN usuario ON comentario.idUsuario = usuario.idUsuario where idPublicacion = ?";

  connection.query(getCommentsquery, [idPublicacion], (err, results) => {
    if (err) {
      console.error("Error al obtener los comentarios", err);
      return res
        .status(400)
        .json({ message: "Error al obtener los comentarios" });
    }

    res.status(200).json({ comentarios: results });
  });
};
