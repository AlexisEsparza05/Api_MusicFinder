const express = require('express');
const mongoose = require('mongoose');
const Profile = require('../models/profile'); // Importamos el modelo de Mongoose
const router = express.Router();

// Middleware para procesar JSON
router.use(express.json());

// Ruta para obtener un perfil por ID
router.get('/getProfile/:id', async (req, res) => {
  const userId = req.params.id;

  // Verificar si el ID es válido
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'ID de usuario no válido' });
  }

  try {
    const userProfile = await Profile.findById(userId);

    if (!userProfile) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(200).json(userProfile);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el perfil', details: err.message });
  }
});

// Ruta para editar un perfil por ID
router.put('/editProfile/:id', async (req, res) => {
  const userId = req.params.id;
  const updatedProfile = req.body;

  const allowedFields = ['nombre', 'instrumento', 'precio', 'ubicacion', 'imagen', 'descripcion'];
  const updateData = {};

  allowedFields.forEach(field => {
    if (updatedProfile[field] !== undefined) {
      updateData[field] = updatedProfile[field];
    }
  });

  try {
    const userProfile = await Profile.findByIdAndUpdate(userId, updateData, { new: true });

    if (!userProfile) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(200).json({ message: 'Perfil actualizado correctamente', userProfile });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar el perfil', details: err.message });
  }
});

// Ruta para obtener un perfil por email
router.get('/getProfileByEmail/:correo', async (req, res) => {
  const correo = req.params.correo;

  try {
    const userProfile = await Profile.findOne({ correo });

    if (!userProfile) {
      return res.status(404).json({ error: 'Profesor no encontrado' });
    }

    res.status(200).json(userProfile);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el perfil', details: err.message });
  }
});

module.exports = router;
