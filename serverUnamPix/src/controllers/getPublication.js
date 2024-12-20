const connection = require("../models/db");

module.exports.getPublication = (req, res) => {
  const getQuery = "SELECT * FROM publicacion";

  connection.query(getQuery, (err, results) => {
    if (err) {
      console.error("Error al obtener las publicaciones", err);
      return res
        .status(400)
        .json({ message: "Error al obtener las publicaciones" });
    }

    res.status(200).json(results);
  });
};
