const User = require("../models/user");  // Importar el modelo User

// Controlador para manejar el login
const login = async (req, res) => {
  const { correo, contraseña } = req.body;

  if (!correo || !contraseña) {
    return res.status(400).json({ error: "Correo y contraseña son requeridos" });
  }

  try {
    // Buscar el usuario por correo
    const usuario = await User.findOne({ correo: correo.trim().toLowerCase() });

    if (!usuario) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    // Verificar la contraseña (Aquí asumo que las contraseñas están cifradas)
    if (usuario.contraseña !== contraseña) {  // Aquí deberías usar un método de comparación de contraseñas cifradas como bcrypt.compare()
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    // Si las credenciales son correctas
    res.status(200).json({
      id: usuario.id,
      nombre: usuario.nombre,
      rol: usuario.rol,
      mensaje: "Inicio de sesión exitoso",
    });
  } catch (error) {
    console.error("Error al realizar el login:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = { login };
