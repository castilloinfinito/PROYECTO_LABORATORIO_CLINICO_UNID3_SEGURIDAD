require('dotenv').config();
const mongoose = require('mongoose');
const { Usuario } = require('../models/LaboratorioModels');

async function migrate() {
  await mongoose.connect(process.env.MONGO_URI);
  
  // 1. Crear índices necesarios
  await Usuario.createIndexes();
  
  // 2. Verificar usuario admin por defecto
  const adminExist = await Usuario.findOne({ rol: 'Admin' });
  if (!adminExist) {
    await Usuario.create({
      username: 'admin_central',
      password: 'ClaveMaestraSegura', 
      rol: 'Admin',
      cargo: 'Root'
    });
    console.log("Migración exitosa: Usuario admin creado.");
  }
  process.exit();
}
migrate();