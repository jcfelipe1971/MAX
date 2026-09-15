// backend/src/routes/auth.js
const express = require("express");
const router = express.Router();
const db = require("../config/database");

router.post("/login", async (req, res) => {
  const { usuario, password } = req.body;

  try {
    // Consulta directa a SYS_USUARIOS
    const query = `
      SELECT USUARIO, NOMBRE, CLAVE, NIVEL, EMPRESA, EJERCICIO, CANAL, SERIE, 
             FECHA_TRABAJO, MEMORIZAR_FECHA, ACTIVO
      FROM SYS_USUARIOS 
      WHERE NOMBRE = ? AND ACTIVO = 1
    `;

    const result = await db.query(query, [usuario.toUpperCase()]);

    if (result.length === 0) {
      return res.status(401).json({
        success: false,
        error: "Usuario no encontrado",
      });
    }

    const user = result[0];

    // Comparación de contraseña (case-sensitive)
    // Si la clave en BD es "a" y el usuario ingresa "a", debe coincidir
    if (user.CLAVE !== password) {
      return res.status(401).json({
        success: false,
        error: "Contraseña incorrecta",
      });
    }

    // Preparar entorno
    const entorno = {
      empresa: user.EMPRESA || 1,
      ejercicio: user.EJERCICIO || new Date().getFullYear(),
      canal: user.CANAL || 1,
      serie: user.SERIE || "",
      fechaTrabajo:
        user.MEMORIZAR_FECHA && user.FECHA_TRABAJO
          ? user.FECHA_TRABAJO.toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
    };

    res.json({
      success: true,
      user: {
        id: user.USUARIO,
        nombre: user.NOMBRE,
        nivel: user.NIVEL,
      },
      entorno: entorno,
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({
      success: false,
      error: "Error en el servidor",
    });
  }
});

module.exports = router;
