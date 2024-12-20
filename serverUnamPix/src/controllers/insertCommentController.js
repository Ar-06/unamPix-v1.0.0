const { insertComments } = require("./insertComments");

module.exports.insertCommentController = (req, res) => {
  const { token, idPublicacion, comentario } = req.body;

  if (!token || !idPublicacion || !comentario) {
    return res.status(400).json({ error: "Faltan datos necesarios" });
  }

  insertComments(token, idPublicacion, comentario, (err, newComment) => {
    if (err) {
      return res.status(500).json({ error: err.error });
    }

    res.status(201).json(newComment);
  });
};
