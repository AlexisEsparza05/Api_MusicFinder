const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// Importa el modelo de Profile que has definido
const Profile = require("../models/profile");

// Endpoint para obtener datos del usuario por ID
router.post("/getUser", async (req, res) => {
  const { id } = req.body;

  // Verifica si el ID está presente
  if (!id) {
    return res.status(400).json({ error: "El ID del usuario es requerido" });
  }

  // Verifica si el ID es un ObjectId válido
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    // Busca el perfil en la base de datos por ID
    const usuario = await Profile.findById(id);

    // Verifica si el usuario fue encontrado
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Retorna el perfil encontrado
    res.status(200).json(usuario);
  } catch (error) {
    console.error("Error al obtener el perfil:", error);
    res.status(500).json({ error: "Error al obtener el perfil" });
  }
});

module.exports = router;
