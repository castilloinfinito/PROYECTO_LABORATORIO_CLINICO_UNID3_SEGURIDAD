require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const path = require('path');
const cors = require('cors');

// 1. IMPORTACIÓN DE MODELOS
const { Usuario, Paciente, Medico, Examen, Resultado } = require('./models/LaboratorioModels');

// 2. IMPORTACIÓN DE CONTROLADORES
const { PacienteCtrl, MedicoCtrl, ExamenCtrl, UsuarioCtrl, ResultadoCtrl } = require('./controllers/GeneralController');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'laboratorio_secreto_2026';

// --- CONFIGURACIÓN DE MOTOR DE PLANTILLAS ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// --- MIDDLEWARES GLOBALES ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// --- RUTAS PARA DESPLEGAR EL FRONTEND (VISTAS EJS) ---
app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/', (req, res) => {
    res.render('index');
});

// --- MIDDLEWARE DE SEGURIDAD JWT ---
const auth = (rolesPermitidos = []) => {
    return (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ success: false, error: "Acceso denegado. Token no proporcionado." });
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(decoded.rol)) {
                return res.status(403).json({ success: false, error: "No tienes permisos para esta acción." });
            }
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(403).json({ success: false, error: "Token inválido o expirado." });
        }
    };
};

// --- RUTA DE AUTENTICACIÓN (API) ---
app.post('/auth', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ error: "Faltan datos" });

        const user = await Usuario.findOne({ username: username.trim() });
        if (!user || !(await user.compararPassword(password))) {
            return res.status(401).json({ success: false, error: "Usuario o clave incorrectos" });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username, rol: user.rol },
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({
            success: true,
            token,
            user: { username: user.username, rol: user.rol }
        });
    } catch (e) {
        res.status(500).json({ success: false, error: "Error en login" });
    }
});

// --- RUTAS DE LA API (DATOS) ---
app.get('/api/pacientes', auth(['Admin', 'Bioanalista', 'Recepcion']), PacienteCtrl.listar);
app.post('/api/pacientes', auth(['Admin', 'Recepcion']), PacienteCtrl.crear);
app.put('/api/pacientes/:id', auth(['Admin', 'Recepcion']), PacienteCtrl.actualizar);
app.delete('/api/pacientes/:id', auth(['Admin']), PacienteCtrl.eliminar);

app.get('/api/medicos', auth(['Admin', 'Bioanalista', 'Recepcion']), MedicoCtrl.listar);
app.post('/api/medicos', auth(['Admin']), MedicoCtrl.crear);
app.put('/api/medicos/:id', auth(['Admin']), MedicoCtrl.actualizar);
app.delete('/api/medicos/:id', auth(['Admin']), MedicoCtrl.eliminar);

app.get('/api/examenes', auth(['Admin', 'Bioanalista', 'Recepcion']), ExamenCtrl.listar);
app.post('/api/examenes', auth(['Admin']), ExamenCtrl.crear);

app.get('/api/resultados', auth(['Admin', 'Bioanalista', 'Recepcion']), ResultadoCtrl.listar);
app.post('/api/resultados', auth(['Admin', 'Bioanalista']), ResultadoCtrl.crear);
app.put('/api/resultados/:id', auth(['Admin', 'Bioanalista']), ResultadoCtrl.actualizar);

app.get('/api/usuarios', auth(['Admin']), UsuarioCtrl.listar);
app.post('/api/usuarios', auth(['Admin']), UsuarioCtrl.crear);

// --- CONEXIÓN Y ARRANQUE ---
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/laboratorio_pro';

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("----------------------------------------------");
        console.log("✅ Conexión a MongoDB: OK");
        // Escuchamos en 3000 para resolver problemas de conexión local
        app.listen(PORT, '0.0.0.0', '3000', () => {
            console.log(`🚀 Servidor iniciado con éxito`);
            console.log(`🔗 Acceso Local: http://127.0.0.1:${PORT}/login`);
            console.log(`🔗 Acceso Red:   http://localhost:${PORT}/login`);
            console.log("----------------------------------------------");
        });
    })
    .catch(err => {
        console.error("❌ Error al conectar BD:", err);
        process.exit(1);
    });