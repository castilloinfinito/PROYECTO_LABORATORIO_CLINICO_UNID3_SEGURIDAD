// declaracion de variables para importacion
const express = require('express');
const Ctrl = require('../controllers/GeneralController');
const router = express.Router();
// Importamos el nuevo middleware de JWT (asumiendo que lo creaste según la guía anterior)
const { verificarAcceso } = require('../middlewares/authMiddleware');

const mapeo = {
  pacientes: Ctrl.PacienteCtrl,
  medicos: Ctrl.MedicoCtrl,
  examenes: Ctrl.ExamenCtrl,
  usuarios: Ctrl.UsuarioCtrl,
  resultados: Ctrl.ResultadoCtrl
};

// 1. RUTAS PÚBLICAS (Sin necesidad de Login) 
// Según requerimientos: Seleccionar qué información es visible para cualquiera.
router.get('/examenes/public', (req, res) => {
    
    Ctrl.ExamenCtrl.listar(req, res);
});

// 2. RUTAS CON FILTRO DE ROLES 

// GESTIÓN DE USUARIOS: Solo el Administrador puede tocar esto.
router.use('/usuarios', verificarAcceso(['Admin'])); 
// (Cualquier ruta que empiece con /usuarios ahora requiere ser Admin)

// GESTIÓN DE PACIENTES: Recepción crea, Admin elimina.
router.post('/pacientes', verificarAcceso(['Admin', 'Recepcion']), Ctrl.PacienteCtrl.crear);
router.delete('/pacientes/:id', verificarAcceso(['Admin']), Ctrl.PacienteCtrl.eliminar);

// GESTIÓN DE RESULTADOS: Solo el Bioanalista o Admin cargan resultados.
router.post('/resultados', verificarAcceso(['Admin', 'Bioanalista']), Ctrl.ResultadoCtrl.crear);
router.put('/resultados/:id', verificarAcceso(['Admin', 'Bioanalista']), Ctrl.ResultadoCtrl.actualizar);

// --- 3. BUCLE PARA OPERACIONES RESTANTES (Lectura General) ---
Object.keys(mapeo).forEach(ent => {
  // Todos los usuarios logueados pueden VER (listar) los datos
  router.get(`/${ent}`, verificarAcceso(['Admin', 'Bioanalista', 'Recepcion']), mapeo[ent].listar);
  
  // Para las rutas que no definimos arriba manualmente, usamos un acceso genérico o Admin
  // Esto evita que el bucle sobreescriba las reglas específicas de arriba
  if (!router.stack.some(layer => layer.route && layer.route.path === `/${ent}` && layer.route.methods.post)) {
      router.post(`/${ent}`, verificarAcceso(['Admin']), mapeo[ent].crear);
      router.put(`/${ent}/:id`, verificarAcceso(['Admin']), mapeo[ent].actualizar);
      router.delete(`/${ent}/:id`, verificarAcceso(['Admin']), mapeo[ent].eliminar);
  }
});

module.exports = router;