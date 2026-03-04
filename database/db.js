// Importa Mongoose permite hablar con MongoDB usando objetos de JavaScript
const mongoose = require('mongoose');
// Usamos async para que el programa sepa que debe "esperar" a que la conexión se complete
const conectarDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/laboratorio_pro');
    console.log("✅ Conexión a MongoDB exitosa");
    // Si algo sale mal el código "atrapa" el error
  } catch (error) {
    console.error("❌ Error de conexión:", error);
    process.exit(1);
  }
};
module.exports = conectarDB;