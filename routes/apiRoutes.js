const express = require('express');
const router = express.Router();
const { PacienteCtrl, MedicoCtrl, ExamenCtrl, UsuarioCtrl, ResultadoCtrl } = require('../controllers/GeneralController');

// Middleware de Seguridad por Roles
const auth = (roles) => (req, res, next) => {
    if (req.session && req.session.usuarioLogueado && roles.includes(req.session.usuarioLogueado.rol)) {
        return next();
    }
    res.status(401).json({ success: false, error: "No autorizado. Inicia sesión como: " + roles.join(', ') });
};

// --- RUTAS DE PACIENTES ---
router.get('/pacientes', auth(['Admin', 'Bioanalista', 'Recepcion']), PacienteCtrl.listar);
router.post('/pacientes', auth(['Admin', 'Recepcion']), PacienteCtrl.crear);
router.put('/pacientes/:id', auth(['Admin', 'Recepcion']), PacienteCtrl.actualizar);
router.delete('/pacientes/:id', auth(['Admin']), PacienteCtrl.eliminar);

// --- RUTAS DE MÉDICOS ---
router.get('/medicos', auth(['Admin', 'Bioanalista', 'Recepcion']), MedicoCtrl.listar);
router.post('/medicos', auth(['Admin']), MedicoCtrl.crear);
router.put('/medicos/:id', auth(['Admin']), MedicoCtrl.actualizar);
router.delete('/medicos/:id', auth(['Admin']), MedicoCtrl.eliminar);

// --- RUTAS DE EXÁMENES ---
router.get('/examenes', auth(['Admin', 'Bioanalista', 'Recepcion']), ExamenCtrl.listar);
router.get('/examenes/public', ExamenCtrl.listar); 
router.post('/examenes', auth(['Admin']), ExamenCtrl.crear);

// --- RUTAS DE RESULTADOS ---
router.get('/resultados', auth(['Admin', 'Bioanalista', 'Recepcion']), ResultadoCtrl.listar);
router.post('/resultados', auth(['Admin', 'Bioanalista']), ResultadoCtrl.crear);
router.put('/resultados/:id', auth(['Admin', 'Bioanalista']), ResultadoCtrl.actualizar);

// --- RUTAS DE USUARIOS ---
router.get('/usuarios', auth(['Admin']), UsuarioCtrl.listar);
router.post('/usuarios', auth(['Admin']), UsuarioCtrl.crear);

module.exports = router;