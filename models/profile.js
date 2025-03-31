const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  correo: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  instrumento: { type: String, default: "Instrumento no especificado" },
  precio: { type: String, default: "$0/hora" },
  ubicacion: { type: String, default: "Ubicación no especificada" },
  rating: { type: Number, default: 0 },
  imagen: { type: String, default: "assets/default_profile.jpg" },
  descripcion: { type: String, default: "Descripción no disponible" },
  rol: { type: String, default: "Profesor" },
});

module.exports = mongoose.model("Profile", ProfileSchema);
