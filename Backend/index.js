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
  try {
    const { titulo, url, descripcion } = req.body;
    if (!descripcion || !titulo || !url)
      return res.status(400).json({
        message: "Debes ingresar el título, la imagen y descripción del post.",
      });

    const result = await agregarPost(titulo, url, descripcion, 0);
    if (result.rowCount !== 1) throw new Error("NOT_CREATED");

    return res
      .status(201)
      .json({ message: "Post creado", post: { ...req.body } });
  } catch (e) {
    if (e.message === "NOT_CREATED")
      return res.status(500).json({ message: "No se pudo crear el post." });
    return res.status(500).json(e);
  }
});

app.get("/posts", async (_req, res) => {
  try {
    const posts = await conseguirPosts();
    return res.status(200).json(posts);
  } catch (e) {
    return res.status(500).json(e);
  }
});

app.put("/posts/like/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const post = await darLike(id);
    if (!post) throw new Error("NOT_FOUND");
    return res.status(200).json({
      message: "Se ha dado like",
      post,
    });
  } catch (e) {
    if (e.message === "NOT_FOUND")
      return res
        .status(404)
        .json({ message: `No se encontró el post con ID: ${req.params.id}` });
    return res.status(500).json(e);
  }
});

app.delete("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await eliminarPost(id);
    if (!result) throw new Error("NOT_FOUND");
    return res.status(200).json({
      message: `Se ha eliminado el post ${id}.`,
      deleted: result,
    });
  } catch (e) {
    if (e.message === "NOT_FOUND")
      return res
        .status(404)
        .json({ message: `No se encontró el post con ID: ${req.params.id}` });
    return res.status(500).json(e);
  }
});
