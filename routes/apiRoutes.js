const express = require('express');
const Ctrl = require('../controllers/GeneralController');
const router = express.Router();

const mapeo = {
  pacientes: Ctrl.PacienteCtrl,
  medicos: Ctrl.MedicoCtrl,
  examenes: Ctrl.ExamenCtrl,
  usuarios: Ctrl.UsuarioCtrl,
  resultados: Ctrl.ResultadoCtrl
};

//  MIDDLEWARE ---
const verificarAPI = (req, res, next) => {
  if (req.session && req.session.usuarioLogueado) {
    next();
  } else {
    res.status(401).json({ error: "No autorizado. Inicie sesión primero." });
  }
};

//  REEMPLAZA EL BUCLE ANTERIOR 
Object.keys(mapeo).forEach(ent => {
  // Ahora cada ruta lleva 'verificarAPI' antes del controlador
  router.get(`/${ent}`, verificarAPI, mapeo[ent].listar);
  router.post(`/${ent}`, verificarAPI, mapeo[ent].crear);
  router.put(`/${ent}/:id`, verificarAPI, mapeo[ent].actualizar);
  router.delete(`/${ent}/:id`, verificarAPI, mapeo[ent].eliminar);
});

module.exports = router;