// declaracion de variables
const mongoose = require('mongoose');
// estructura de esquema de datos en el documento para cada coleccion
// entidad base de la operacion del laboratorio " paciente"
const PacienteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  ci: { type: String, required: true, unique: true },
  telefono: { type: String }
}, { timestamps: true });

const MedicoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  especialidad: { type: String, required: true },
  mpps: { type: String, required: true }
}, { timestamps: true });
// en el docomento de examen se incrustan el n de orden y id medico para mayor trazabilidad
// de los datos este es la coleccion base que con paciente y resultados son el eje del sstema

const ExamenSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  precio: { type: Number, required: true },
  numeroOrden: { type: String, required: true },
  medicoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medico' }
}, { timestamps: true });

// en el docomento de resltado se incrustan el n de orden y id medico  y el paciente para mayor trazabilidad
// de los datos este es la coleccion base que con paciente y resultados son el eje del sstema
const ResultadoSchema = new mongoose.Schema({
  numeroOrden: { type: String, required: true },
  pacienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Paciente', required: true },
  medicoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medico' },
  valor: { type: String, required: true },
  fecha: { type: Date, default: Date.now }
}, { timestamps: true });

const UsuarioSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  rol: { type: String, enum: ['Admin', 'Bioanalista', 'Recepcion'], default: 'Bioanalista' },
  cargo: { type: String, required: true }, password: { type: String, required: true }
}, { timestamps: true });
  


// formato resumen de exportacion para simplificar codigo
module.exports = {
  Paciente: mongoose.model('Paciente', PacienteSchema),
  Medico: mongoose.model('Medico', MedicoSchema),
  Examen: mongoose.model('Examen', ExamenSchema),
  Resultado: mongoose.model('Resultado', ResultadoSchema),
  Usuario: mongoose.model('Usuario', UsuarioSchema)
};