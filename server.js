const express = require("express");
const path = require("path");

const app = express();
const port = 3000; // Puedes cambiar este puerto si lo deseas

// Servir archivos estáticos desde la carpeta raíz del proyecto
app.use(express.static(path.join(__dirname)));

// Ruta principal que sirve el archivo index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
