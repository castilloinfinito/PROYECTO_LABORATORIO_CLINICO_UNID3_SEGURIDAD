
// declaracion de variable
  const { Paciente, Medico, Examen, Usuario, Resultado } = require('../models/LaboratorioModels');
// uso de clase como plantilla general y controlador generico  unico POO
class GenericController {
  constructor(model) {
    this.model = model;
  }
  // INCLUSION DE FUNCIONES PARA OPERACIONES CRUD, USO DE PROMESAS
  // CON async-await para ordenar ejecucion secuelcial de la funcion
   listar = async (req, res) => {
  try {
    let query = this.model.find();
    const paths = this.model.schema.paths;

    // Control absoluto de relaciones: Si existe el campo, trae los datos del objeto
    if (paths.medicoId) query = query.populate('medicoId', 'nombre');
    if (paths.pacienteId) query = query.populate('pacienteId', 'nombre');
    
    // Si estamos en Resultados, el administrador necesita ver todo el contexto
    const data = await query.sort({ createdAt: -1 }).lean(); 
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}


// uso de promesas para crear documentos de la coleccion
  crear = async (req, res) => {
    try {
      const nuevo = await this.model.create(req.body);
      res.status(201).json(nuevo);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  }

// uso de promesas para actualizar documentos.
  actualizar = async (req, res) => {
    try {
      const editado = await this.model.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!editado) return res.status(404).json({ error: "No encontrado" });
      res.json(editado);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  }
 // eliminar documento por id, verificacion de errores, uso de promesas

  eliminar = async (req, res) => {
    try {
      const borrado = await this.model.findByIdAndDelete(req.params.id);
      if (!borrado) return res.status(404).json({ error: "No encontrado" });
      res.json({ mensaje: "Eliminado correctamente" });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  }
}
// unificacion de formato para exportar los metododos de control de las solicitudes
module.exports = {
  PacienteCtrl: new GenericController(Paciente),
  MedicoCtrl: new GenericController(Medico),
  ExamenCtrl: new GenericController(Examen),
  UsuarioCtrl: new GenericController(Usuario),
  ResultadoCtrl: new GenericController(Resultado)
};