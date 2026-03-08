const mongoose = require('mongoose');
const path = require('path');
const { Usuario } = require('./models/LaboratorioModels');

mongoose.connect('mongodb://127.0.0.1:27017/laboratorio_pro')
  .then(async () => {
    console.log("Eliminando usuarios viejos...");
    await Usuario.deleteMany({});
    console.log("Creando usuario limpio: admin / 123");
    const nuevoAdmin = new Usuario({
      username: 'admin',
      password: '123',
      rol: 'Admin',
      cargo: 'Jefe'
    });
    await nuevoAdmin.save();
    console.log("✅ Usuario arreglado. Cierra esta terminal y corre app.js");
    process.exit();
  });