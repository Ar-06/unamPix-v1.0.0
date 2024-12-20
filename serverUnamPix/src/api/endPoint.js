const express = require("express");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { ping } = require("../controllers/pingController");
const { register } = require("../controllers/registerController");
const { login } = require("../controllers/loginController");
const { publication } = require("../controllers/publicationController");
const { getPublication } = require("../controllers/getPublication");
const { getPublicationById } = require("../controllers/getIdPublication");
const {
  insertCommentController,
} = require("../controllers/insertCommentController");
const { getComments } = require("../controllers/getComments");
const { getEtiquetas } = require("../controllers/getEtiquetas");
const { updateLike } = require("../controllers/updateLike");
const { getLikes } = require("../controllers/getLikes");
const { checkUserLike } = require("../controllers/checkUserLike");
const { getUrlImage } = require("../controllers/getUrlImage");
const {
  getPublicationCategory,
} = require("../controllers/getPublicationByCategory");
const { getAllCategory } = require("../controllers/getAllCategory");
const { loginMod } = require("../controllers/loginModerador");
const { getEventsandImage } = require("../controllers/getEventsandImages");
const { insertEvent } = require("../controllers/insertEvent");
const { getEvents } = require("../controllers/getEvent");
const { deleteImage } = require("../controllers/deleteImages");
const { participaEvento } = require("../controllers/insertParticipar");
const { deleteEvento } = require("../controllers/deleteEvents");
const { getPublicationByUser } = require("../controllers/getPublicationbyUser");
const { updatePublication } = require("../controllers/updatePublication");
const { deleteImageUser } = require("../controllers/deleteImageUser");

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../../public/images"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const authenticateJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, "Stack", (err, usuario) => {
      if (err) {
        console.error("Error al verificar el usuario", err);
        return res.sendStatus(403);
      }
      console.log("Usuario decodificado", usuario);
      req.usuario = usuario;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

router.get("/ping", ping);
router.post("/register", register);
router.post("/login", login);
router.post("/loginMod", loginMod);
router.post(
  "/publication",
  authenticateJwt,
  upload.single("image"),
  publication
);
router.post("/like/:idPublicacion", authenticateJwt, updateLike);
router.post("/comentarios", insertCommentController);
router.post("/createEvent", insertEvent);
router.post("/eventos/participar", participaEvento);

router.get("/like/:idPublicacion/check", checkUserLike);
router.get("/publications", getPublication);
router.get("/publicacion/:idPublicacion", getPublicationById);
router.get("/comentarios/:idPublicacion", getComments);
router.get("/etiquetas/:idPublicacion", getEtiquetas);
router.get("/publicacion/:idPublicacion/likes", getLikes);
router.get("/:idPublicacion/images", getUrlImage);
router.get("/publicaciones/:categoria", getPublicationCategory);
router.get("/categorias", getAllCategory);
router.get("/eventsImage", getEventsandImage);
router.get("/events", getEvents);
router.get("/usuario/publicaciones", authenticateJwt, getPublicationByUser);

router.delete("/deletePublication/:idPublicacion", deleteImage);
router.delete("/deleteConcurso/:idEvento", deleteEvento);
router.delete("/deletePublication/:idPublicacion", deleteImageUser);

router.put("/updatePublication/:idPublicacion", updatePublication);

module.exports = router;
