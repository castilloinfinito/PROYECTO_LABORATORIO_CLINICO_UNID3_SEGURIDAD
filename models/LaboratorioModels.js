const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// ESQUEMA DE USUARIO
const UsuarioSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    rol: { type: String, enum: ['Admin', 'Recepcion', 'Bioanalista'], default: 'Recepcion' },
    cargo: { type: String }
}, { timestamps: true });

// MIDDLEWARE DE CIFRADO (Definitivo: Sin 'next', usa promesas async)
UsuarioSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        throw error;
    }
});

// MÉTODO PARA COMPARAR CLAVES
UsuarioSchema.methods.compararPassword = async function(passwordCandidata) {
    return await bcrypt.compare(passwordCandidata, this.password);
};

// OTROS ESQUEMAS (Simplificados para tu arquitectura)
const PacienteSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    ci: { type: String, required: true, unique: true },
    telefono: String
}, { timestamps: true });

const MedicoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    especialidad: String,
    mpps: String
}, { timestamps: true });

const ExamenSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    precio: Number,
    numeroOrden: String,
    medicoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medico' }
}, { timestamps: true });

const ResultadoSchema = new mongoose.Schema({
    numeroOrden: String,
    pacienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Paciente' },
    medicoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medico' },
    valor: String,
    fecha: { type: Date, default: Date.now }
}, { timestamps: true });

// EXPORTACIÓN ÚNICA
module.exports = {
    Usuario: mongoose.model('Usuario', UsuarioSchema),
    Paciente: mongoose.model('Paciente', PacienteSchema),
    Medico: mongoose.model('Medico', MedicoSchema),
    Examen: mongoose.model('Examen', ExamenSchema),
    Resultado: mongoose.model('Resultado', ResultadoSchema)
};