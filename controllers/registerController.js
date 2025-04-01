const User = require("../models/user.js");
const Profile = require("../models/profile.js");

exports.register = async (req, res) => {
  try {
    const { nombre, correo, contraseña, rol } = req.body;

    if (!nombre || !correo || !contraseña || !rol) {
      return res.status(400).json({ mensaje: "Todos los campos son necesarios" });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ correo });
    if (existingUser) {
      return res.status(400).json({ mensaje: "El correo ya está registrado" });
    }

    // Crear nuevo usuario
    const newUser = new User({
      nombre,
      correo,
      contraseña, // ⚠️ Se recomienda hashear la contraseña con bcrypt
      rol,
    });

    // Guardar el usuario
    await newUser.save();

    // Crear perfil para el usuario con el mismo ID
    const newProfile = new Profile({
      _id: newUser._id,  // Asignar el _id del usuario al perfil
      correo,
      nombre,
      rol,
    });

    // Guardar el perfil
    await newProfile.save();

    res.status(201).json({ mensaje: "Usuario y perfil registrados exitosamente" });

  } catch (error) {
    console.error("Error en el registro:", error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};
