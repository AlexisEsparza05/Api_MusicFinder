const express = require('express');
const router = express.Router();
const Profile = require('../models/profile');

// Función para obtener todos los perfiles de profesores con los campos filtrados
const getProfessors = (req, res) => {
  Profile.find({ rol: "Profesor" })
    .select("nombre instrumento precio ubicacion rating imagen descripcion") // Seleccionar solo los campos necesarios
    .then(profesores => {
      return res.status(200).json(profesores);
    })
    .catch(err => {
      console.error("Error al obtener los perfiles de los profesores:", err);
      return res.status(500).json({ error: "Error al obtener los perfiles de los profesores" });
    });
};

// Ruta para obtener los perfiles de los profesores
router.get('/', getProfessors);

module.exports = router;
