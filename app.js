require("dotenv").config(); // Cargar variables de entorno
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

// Importación de controladores
const reservasController = require("./controllers/reservasController");
const HomeAlumnoController = require("./controllers/HomeAlumnoController");
const userController = require("./controllers/userController");
const profileController = require("./controllers/profileController");
const loginController = require("./controllers/loginController");
const registerController = require("./controllers/registerController");
const passwordController = require("./controllers/passwordController");

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Conectado a MongoDB Atlas"))
.catch(err => console.error("❌ Error al conectar a MongoDB:", err));

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));

// Rutas para login
app.post("/login", loginController.login);
app.post("/register", registerController.register);

// Rutas para cambiar contraseña
app.post("/enviar-codigo", passwordController.enviarCodigo);
app.post("/cambiar-password", passwordController.cambiarPassword);

// Rutas del perfil
app.post("/getUser", userController);

// Integración del controlador de perfil
app.use('/api/profiles', profileController);

// Rutas de reservas
app.put("/reservas", reservasController.crearReserva);
app.get("/reservas", reservasController.obtenerReservas);

// Agregar la ruta para HomeAlumnoController
app.use('/api/homealumno', HomeAlumnoController); 

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});