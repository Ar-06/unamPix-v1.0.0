const connection = require("../models/db");

module.exports.getAllCategory = (req, res) => {
  const queryGetCategory = "SELECT DISTINCT Categoria FROM publicacion";

  connection.query(queryGetCategory, (err, results) => {
    if (err) {
      console.error("Error al obtener las categorias", err);
      return res
        .status(500)
        .json({ message: "Error al obtener las categorias" });
    }
    res.status(200).json({ categorias: results });
  });
};
