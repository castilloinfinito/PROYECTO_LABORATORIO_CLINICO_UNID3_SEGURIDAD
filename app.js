// Carga de variables de entorno (.env)
require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const apiRoutes = require('./routes/apiRoutes');
const { Usuario } = require('./models/LaboratorioModels');

const app = express();

//  1. CONFIGURACIÓN DE BASE DE DATOS 
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/laboratorio_pro';
mongoose.connect(mongoURI)
  .then(() => console.log('✅ Conexión a MongoDB exitosa'))
  .catch(err => console.error('❌ Error de conexión:', err));

//  CONFIGURACIÓN DE MOTOR DE VISTAS Y EJS 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// . CONFIGURACIÓN DE SESIÓN 
app.use(session({
  secret: process.env.JWT_SECRET || 'clave_maestra_segura_123',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 3600000 } // Sesión por 1 hora
}));

// RUTA RAIZ: Ahora pasa por protegerVista (EL MURO DE SEGURIDAD)

//Middleware protegerVista:

const protegerVista = async (req, res, next) => {
if (req.session && req.session.usuarioLogueado) {
try {
const usuarioDb = await Usuario.findById(req.session.usuarioLogueado.id);
if (!usuarioDb) {
req.session.destroy();
return res.redirect('/login');
}
res.locals.user = usuarioDb;
next();
} catch (err) {
res.redirect('/login');
}
} else {
res.redirect('/login');
}
};

// Ruta de Autenticación:

app.post('/auth', async (req, res) => {
try {
const { username, password } = req.body;
const { username, password } = req.body;
const user = await Usuario.findOne({ username });

// Verificamos si el usuario existe y si la contraseña coincide usando el método que creamos
if (user && await user.compararPassword(password)) {
    req.session.usuarioLogueado = { id: user._id, username: user.username };
    res.redirect('/');
} else {
    // ... error
}

//  visita de login de segurida 
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// RUTAS DE LA API (Protegidas también por el router interno)
app.use('/api', apiRoutes);

// --- 6. LANZAMIENTO ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 LAB-SYSTEM ACTIVO en http://localhost:${PORT}`);
});