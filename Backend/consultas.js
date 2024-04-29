const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "1234",
  database: "likeme",
  allowExitOnIdle: true,
});

const agregarPost = async (titulo, imagen, descripcion, likes) => {
  const consulta = "INSERT INTO posts values (DEFAULT, $1, $2, $3, $4)";
  const values = [titulo, imagen, descripcion, likes];
  const result = await pool.query(consulta, values);
  return result;
};

const conseguirPosts = async () => {
  const consulta = "SELECT * FROM POSTS";
  const result = await pool.query(consulta);
  return result.rows;
};

const darLike = async (id) => {
  const consulta = "SELECT * FROM POSTS WHERE id = $1";
  const result = await pool.query(consulta, [id]);
  if (result.rows.length === 0) return null;
  const consultaUpdate = "UPDATE posts SET likes = $1 WHERE id = $2";
  await pool.query(consultaUpdate, [result.rows[0].likes + 1, id]);
  return { ...result.rows[0], likes: result.rows[0].likes + 1 };
};

const eliminarPost = async (id) => {
  const consulta = "DELETE FROM POSTS WHERE id = $1";
  const result = await pool.query(consulta, [id]);
  return result.rowCount === 1;
};

module.exports = { agregarPost, conseguirPosts, darLike, eliminarPost };
