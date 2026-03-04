const jwt = require('jsonwebtoken');

const verificarAcceso = (rolesPermitidos = []) => {
  return (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1] || req.cookies?.token;

    if (!token) return res.status(401).json({ error: "No autorizado. Inicie sesión." });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.usuario = decoded;

      // Verificación de roles
      if (rolesPermitidos.length && !rolesPermitidos.includes(decoded.rol)) {
        return res.status(403).json({ error: "Prohibido: No tienes los permisos necesarios para esta operación." });
      }
      next();
    } catch (err) {
      return res.status(401).json({ error: "Sesión inválida o expirada." });
    }
  };
};

module.exports = { verificarAcceso };