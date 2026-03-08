const verificarAcceso = (rolesPermitidos = []) => {
    return (req, res, next) => {
        // Buscamos la sesión que creamos en app.js
        const usuarioSession = req.session.usuarioLogueado;

        if (!usuarioSession) {
            return res.status(401).json({ 
                error: "No autorizado", 
                mensaje: "Debe iniciar sesión para acceder a este recurso." 
            });
        }

        // Si se especificaron roles, verificamos el permiso
        if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(usuarioSession.rol)) {
            return res.status(403).json({ 
                error: "Prohibido", 
                mensaje: "Su rol no tiene permisos para esta acción." 
            });
        }

        next();
    };
};

module.exports = { verificarAcceso };