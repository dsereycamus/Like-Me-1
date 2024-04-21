const express = require("express");
const cors = require("cors");
const {
  agregarPost,
  conseguirPosts,
  darLike,
  eliminarPost,
} = require("./consultas");

const app = express();

app.use(express.json());
app.use(cors());

app.listen(3000, () => {
  console.log("¡Servidor encendido!");
});

app.post("/posts", async (req, res) => {
  const { titulo, url, descripcion } = req.body;
  if (!descripcion || !titulo || !url)
    return res.status(400).json({
      message: "Debes ingresar el título, la imagen y descripción del post.",
    });

  await agregarPost(titulo, url, descripcion, 0);

  return res
    .status(201)
    .json({ message: "Post creado", post: { ...req.body } });
});

app.get("/posts", async (_req, res) => {
  const posts = await conseguirPosts();
  return res.status(200).json(posts);
});

app.put("/posts/like/:id", async (req, res) => {
  const { id } = req.params;
  const post = await darLike(id);
  return res.status(200).json({
    message: post ? "Se ha dado like" : "No se ha encontrado el post",
    post: post ?? {},
  });
});

app.delete("/posts/:id", async (req, res) => {
  const { id } = req.params;
  const result = await eliminarPost(id);
  return res.status(200).json({
    message: result
      ? `Se ha eliminado el post ${id}.`
      : "El post indicado no existe.",
    deleted: result,
  });
});
