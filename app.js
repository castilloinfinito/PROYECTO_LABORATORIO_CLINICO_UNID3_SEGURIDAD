const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const apiRoutes = require('./routes/apiRoutes');
// IMPORTANTE: Importar el modelo aquí para que esté disponible
const { Usuario } = require('./models/LaboratorioModels');

const app = express();

// --- 1. CONFIGURACIÓN DE BASE DE DATOS ---
mongoose.connect('mongodb://127.0.0.1:27017/laboratorio_pro')
  .then(() => console.log('✅ Conexión a MongoDB exitosa'))
  .catch(err => console.error('❌ Error de conexión:', err));

// --- 2. MIDDLEWARES ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- 3. CONFIGURACIÓN DE SESIÓN ---
app.use(session({
  secret: 'clave_maestra_segura_123',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// --- 4. MIDDLEWARE DE PROTECCIÓN ---
const protegerVista = (req, res, next) => {
  if (req.session && req.session.usuarioLogueado) {
    next();
  } else {
    res.redirect('/login');
  }
};

// --- 5. RUTAS ---

app.get('/login', (req, res) => {
  res.render('login'); 
});

// RUTA AUTH CORREGIDA
app.post('/auth', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(`🔍 Intento de acceso - Usuario: ${username}`);

    // Buscamos el usuario
    const user = await Usuario.findOne({ username, password });

    if (user) {
      console.log('✅ Usuario validado con éxito');
      req.session.usuarioLogueado = true;
      req.session.nombreUsuario = user.username;
      res.redirect('/');
    } else {
      console.log('❌ Credenciales incorrectas');
      res.send(`
        <script>
          alert("Acceso denegado: Usuario o clave incorrecta");
          window.location.href = "/login";
        </script>
      `);
    }
  } catch (err) {
    console.error("Error en auth:", err);
    res.status(500).send("Error interno del servidor");
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

app.get('/', protegerVista, (req, res) => {
  // Pasamos el objeto usuario (que viene del JWT) a la vista EJS
  res.render('index', { user: req.usuario }); 
});

app.use('/api', apiRoutes);

// --- 6. LANZAMIENTO ---
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 LAB-SYSTEM ACTIVO en http://localhost:${PORT}`);
});