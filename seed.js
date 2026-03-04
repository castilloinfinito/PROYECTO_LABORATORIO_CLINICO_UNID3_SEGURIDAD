const mongoose = require('mongoose');
const { Paciente, Medico, Examen, Usuario } = require('./models/LaboratorioModels');


async function seed() {
 await mongoose.connect('mongodb://127.0.0.1:27017/laboratorio_pro');

 // Limpiar datos previos
 await Paciente.deleteMany({});
 await Medico.deleteMany({});

 // Pacientes
 const pacientes = await Paciente.insertMany([
  { nombre: "Juan Perez", ci: "V-123456", telefono: "0414-1112233" },
  { nombre: "Maria Lopez", ci: "V-223344", telefono: "0412-5556677" },
  { nombre: "Carlos Ruiz", ci: "V-998877", telefono: "0424-9990000" },
  { nombre: "Ana Gomez", ci: "V-112233", telefono: "0416-8887766" },
  { nombre: "Luis Sosa", ci: "V-445566", telefono: "0414-3334455" },
  { nombre: "Elena Marín", ci: "V-778899", telefono: "0412-1110000" }
 ]);


 // Medicos
 await Medico.insertMany([
  { nombre: "Dr. House", especialidad: "Diagnóstico", mpps: "12345" },
  { nombre: "Dra. Grey", especialidad: "Cirugía", mpps: "67890" },
  { nombre: "Dr. Strange", especialidad: "Neurocirugía", mpps: "54321" },
  { nombre: "Dra. Quinn", especialidad: "General", mpps: "00987" },
  { nombre: "Dr. Melendez", especialidad: "Cardiología", mpps: "11223" },
  { nombre: "Dra. Foster", especialidad: "Pediatría", mpps: "44556" }
 ]);


 console.log("✅ Base de datos poblada con éxito");
 await Usuario.deleteMany({}); // Limpiar usuarios previos
await Usuario.create({
  username: "admin",
  password: "123", // En producción usa bcrypt para encriptar
  cargo: "Administrador General",
  rol: "Admin"
});
console.log("✅ Usuario administrador creado: admin / 123");
 
 process.exit();
}
seed();
