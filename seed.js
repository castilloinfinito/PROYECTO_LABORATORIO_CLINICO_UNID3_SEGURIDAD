const mongoose = require('mongoose');
const { Paciente, Medico, Usuario } = require('./models/LaboratorioModels');

async function seed() {
  try {
    // 1. Conexión limpia
    await mongoose.connect('mongodb://127.0.0.1:27017/laboratorio_pro');
    console.log("Connectado para limpieza...");

    // 2. Limpiar colecciones (Orden importante)
    await Promise.all([
      Paciente.deleteMany({}),
      Medico.deleteMany({}),
      Usuario.deleteMany({})
    ]);

    // 3. Insertar Pacientes
    await Paciente.insertMany([
      { nombre: "Juan Perez", ci: "V-123456", telefono: "0414-1112233" },
      { nombre: "Maria Lopez", ci: "V-223344", telefono: "0412-5556677" }
    ]);

    // 4. Insertar Medicos
    await Medico.insertMany([
      { nombre: "Dr. House", especialidad: "Diagnóstico", mpps: "12345" },
      { nombre: "Dra. Grey", especialidad: "Cirugía", mpps: "67890" }
    ]);

    
    // Usamos .create() para que se dispare el middleware de encriptación
    await Usuario.create({
      username: "admin",
      password: "123", 
      cargo: "Administrador General",
      rol: "Admin"
    });

    console.log("✅ Base de datos poblada y Admin '123' encriptado con éxito");

  } catch (error) {
    console.error("❌ Error durante el seed:", error);
  } finally {
    // 6. Cerrar siempre la conexión
    await mongoose.disconnect();
    process.exit();
  }
}

seed();