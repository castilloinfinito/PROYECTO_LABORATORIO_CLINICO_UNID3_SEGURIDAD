MANUAL DE USUARIO Y TÉCNICO INTEGRAL PARA LABSYSTEM PRO. ESTE DOCUMENTO SERVIRÁ TANTO PARA LA PUESTA EN MARCHA COMO PARA LA OPERACIÓN DIARIA DEL SISTEMA.
🔬 Manual de Usuario: LabSystem Pro
1. Instalación y Puesta en Marcha
Para ejecutar el sistema en un entorno local, sigue estos pasos:
1.Requisitos: Tener instalado Node.js y MongoDB (Local o Atlas).
2.Dependencias: Ejecuta npm install para instalar: express, mongoose, jsonwebtoken, bcrypt, dotenv y cors.
3.Variables de Entorno: Crea un archivo .env en la raíz con:
MONGO_URI=mongodb://127.0.0.1:27017/laboratorio_pro
JWT_SECRET=tu_clave_secreta_aqui
PORT=3000
4.Migración Inicial: Ejecuta el script de migración para crear el usuario administrador por defecto:
node scripts/migrate.js
5.Inicio: Inicia el servidor con node app.js.

2. Verificación de Conexiones y Métodos HTTP
El sistema utiliza una arquitectura RESTful. Puedes verificar el estado con las siguientes acciones:
●Conexión DB: Si al iniciar ves ✅ Conexión a MongoDB exitosa, el backend está listo.
●Métodos Soportados:
GET: Listar registros (Pacientes, Médicos, etc.).
POST: Crear nuevos registros o iniciar sesión.
PUT: Actualizar datos existentes mediante el ID.
DELETE: Eliminar registros (Restringido a Admin).

3. Proceso de Logueo (Autenticación)
En el Backend
1.El servidor recibe username y password vía POST en /auth.
2.Busca al usuario en la colección Usuario.
3.Compara la contraseña usando bcrypt.compare.
4.Si es correcto, genera un JWT (JSON Web Token) firmado con JWT_SECRET que expira en 8 horas.
En el Frontend
1.El formulario captura los datos y los envía al backend.
2.Si la respuesta es exitosa, el navegador guarda el token y el objeto user en el LocalStorage.
3.En cada petición futura, el frontend incluye el token en el encabezado: Authorization: Bearer [TOKEN].
4. Uso de Extensiones de Prueba (Thunder Client / REST Client)
Si deseas probar la API sin el navegador, usa estas herramientas en VS Code:
1.Thunder Client:
Crea una "New Request".
En Auth, selecciona Bearer Token y pega el token generado en el login.
En Body, envía un JSON como: {"nombre": "Juan Perez", "ci": "12345"}.
2.REST Client (.http):
HTTP
POST http://localhost:3000/api/pacientes
Content-Type: application/json
Authorization: Bearer [TU_TOKEN_AQUI]

{
  "nombre": "Juan Perez",
  "ci": "12345"
}

5. Formulario, Entidades y Roles
El formulario ; cambia según el módulo seleccionado.
Limitaciones por Rol
Entidad	Admin	Recepción	Bioanalista
Pacientes	CRUD Completo	Crear / Editar	Solo Ver
Médicos	CRUD Completo	Solo Ver	Solo Ver
Resultados	CRUD Completo	No tiene acceso	Crear / Editar
Usuarios	CRUD Completo	No tiene acceso	No tiene acceso
6. Cuadro de Errores y Soluciones
Código	Error	Significado	Solución
401	No autorizado	No hay un token válido o no has iniciado sesión.	Inicia sesión de nuevo para generar un token.
403	Prohibido	Tu rol no tiene permisos para esa acción específica.	Contacta al Admin para elevar privilegios.
400	Bad Request	Datos inválidos (ej: Cédula duplicada o campos faltantes).	Revisa que los campos obligatorios estén llenos.
404	No encontrado	El ID del registro no existe en la base de datos.	Refresca la tabla y verifica que el dato no fue borrado.
500	Error Interno	Problema de conexión con la base de datos o el servidor.	Verifica que MongoDB esté activo.
7. Ejemplo Práctico de Operación CRUD
Tomemos como ejemplo la entidad Paciente:
1.Create (C): El usuario de Recepción hace clic en "Nuevo Registro", llena nombre y CI, y presiona "Guardar". El sistema ejecuta un POST.
2.Read (R): Al entrar al módulo, el sistema ejecuta un GET y muestra la lista de pacientes en la tabla.
3.Update (U): El Admin presiona el icono amarillo de edición, cambia el teléfono y guarda. El sistema ejecuta un PUT.
4.Delete (D): Solo el Admin verá el icono rojo de basura. Al presionarlo y confirmar, el sistema ejecuta un DELETE.
¿Te gustaría que generara ahora la documentación técnica de la API con los endpoints detallados en formato Markdown?
