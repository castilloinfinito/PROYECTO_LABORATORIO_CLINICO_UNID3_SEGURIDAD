const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

/**
 * 1. CONFIGURACIÓN DE RUTAS SEGURAS (Blindaje contra nombres de carpeta con puntos)
 */
const modelosPath = path.resolve(__dirname, 'models', 'LaboratorioModels.js');

console.log("--------------------------------------------------");
console.log("🔍 DIAGNÓSTICO DE INICIO:");
console.log("Buscando modelos en: " + modelosPath);

// Verificamos si el archivo existe antes de intentar el require
if (!fs.existsSync(modelosPath)) {
    console.error("❌ ERROR: No se encuentra 'LaboratorioModels.js' en la carpeta 'models'.");
    process.exit(1);
}
console.log("✅ Archivo de modelos detectado.");
console.log("--------------------------------------------------");

// 2. CARGA DE MODELOS (Desestructuración exacta de tus 5 modelos)
const { Paciente, Medico, Examen, Resultado, Usuario } = require(modelosPath);

async function seed() {
    try {
        // 3. CONEXIÓN A LA BASE DE DATOS
        const DB_URI = 'mongodb://127.0.0.1:27017/laboratorio_pro';
        await mongoose.connect(DB_URI);
        console.log("🔌 Conectado a MongoDB: laboratorio_pro");

        // 4. LIMPIEZA PROFUNDA (Evita conflictos de IDs o datos viejos)
        console.log("🧹 Limpiando todas las colecciones...");
        await Promise.all([
            Paciente.deleteMany({}),
            Medico.deleteMany({}),
            Examen.deleteMany({}),
            Resultado.deleteMany({}),
            Usuario.deleteMany({})
        ]);

        // 5. INSERCIÓN DE DATOS INICIALES
        console.log("📦 Insertando datos de prueba...");

        await Paciente.insertMany([
            { nombre: "Juan Perez", ci: "V-123456", telefono: "0414-1112233" },
            { nombre: "Maria Lopez", ci: "V-223344", telefono: "0412-5556677" }
        ]);

        await Medico.insertMany([
            { nombre: "Dr. House", especialidad: "Diagnóstico", mpps: "12345" },
            { nombre: "Dra. Grey", especialidad: "Cirugía", mpps: "67890" }
        ]);

        // 6. CREACIÓN DEL ADMINISTRADOR
        // IMPORTANTE: Se usa .create() para que se dispare el middleware de Bcrypt en tu modelo
        await Usuario.create({
            username: "admin",
            password: "123",
            cargo: "Administrador General",
            rol: "Admin"
        });

        console.log("\n✨ ¡PROCESO FINALIZADO CON ÉXITO! ✨");
        console.log("✅ Base de datos reseteada y poblada.");
        console.log("✅ Acceso admin: admin / 123");

    } catch (error) {
        console.error("\n❌ ERROR DURANTE LA EJECUCIÓN DEL SEED:");
        console.error(error.message);
    } finally {
        // 7. CIERRE SEGURO
        await mongoose.disconnect();
        console.log("🔌 Desconectado de MongoDB.");
        process.exit();
    }
}

// Ejecutar el script
seed();