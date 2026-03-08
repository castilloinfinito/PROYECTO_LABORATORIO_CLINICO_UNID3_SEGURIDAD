const { Paciente, Medico, Examen, Usuario, Resultado } = require('../models/LaboratorioModels');

class GenericController {
    constructor(model) {
        this.model = model;
    }

    listar = async (req, res) => {
        try {
            let query = this.model.find();
            if (this.model.modelName === 'Usuario') query = query.select('-password');
            const paths = this.model.schema.paths;
            if (paths.medicoId) query = query.populate('medicoId', 'nombre');
            if (paths.pacienteId) query = query.populate('pacienteId', 'nombre');
            const data = await query.sort({ createdAt: -1 }).lean();
            res.json(data);
        } catch (e) {
            res.status(500).json({ success: false, error: e.message });
        }
    }

    crear = async (req, res) => {
        try {
            const nuevo = await this.model.create(req.body);
            if (this.model.modelName === 'Usuario') nuevo.password = undefined;
            res.status(201).json({ success: true, data: nuevo });
        } catch (e) {
            res.status(400).json({ success: false, error: e.message });
        }
    }

    actualizar = async (req, res) => {
        try {
            let editado;
            if (this.model.modelName === 'Usuario') {
                editado = await this.model.findById(req.params.id);
                if (!editado) return res.status(404).json({ error: "No encontrado" });
                Object.assign(editado, req.body);
                await editado.save();
                editado.password = undefined;
            } else {
                editado = await this.model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
            }
            if (!editado) return res.status(404).json({ error: "No encontrado" });
            res.json({ success: true, data: editado });
        } catch (e) {
            res.status(400).json({ success: false, error: e.message });
        }
    }

    eliminar = async (req, res) => {
        try {
            const borrado = await this.model.findByIdAndDelete(req.params.id);
            if (!borrado) return res.status(404).json({ error: "No encontrado" });
            res.json({ success: true, mensaje: "Eliminado correctamente" });
        } catch (e) {
            res.status(400).json({ success: false, error: e.message });
        }
    }
}

module.exports = {
    PacienteCtrl: new GenericController(Paciente),
    MedicoCtrl: new GenericController(Medico),
    ExamenCtrl: new GenericController(Examen),
    UsuarioCtrl: new GenericController(Usuario),
    ResultadoCtrl: new GenericController(Resultado)
};