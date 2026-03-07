const { Usuario } = require('../models/LaboratorioModels');

const verificarAcceso = (rolesPermitidos = []) => {
return async (req, res, next) => {
const usuarioSession = req.session.usuarioLogueado;
if (!usuarioSession) {
return res.status(401).json({ error: "No autorizado. Inicie sesión." });
}
try {
const usuarioDb = await Usuario.findById(usuarioSession.id);
if (!usuarioDb) {
return res.status(401).json({ error: "Usuario no encontrado." });
}
if (rolesPermitidos.length && !rolesPermitidos.includes(usuarioDb.rol)) {
return res.status(403).json({ error: "Prohibido: Permisos insuficientes." });
}
req.usuario = usuarioDb;
next();
} catch (err) {
return res.status(500).json({ error: "Error de seguridad." });
}
};
};

module.exports = { verificarAcceso };