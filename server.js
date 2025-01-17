const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config(); // Cargar variables de entorno desde Railway automáticamente

const PORT = process.env.PORT || 5001;
const app = express();

// Use CORS middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5001' // Ajusta según el origen de tu frontend
}));

// Sirve archivos estáticos desde la carpeta "public"
app.use(express.static('public'));

// Middleware para parsear JSON
app.use(bodyParser.json());

// Configuración de la conexión a MySQL usando variables de entorno
const dbConfig = {
    host: process.env.MYSQLHOST, // Variable de entorno para el host
    user: process.env.MYSQLUSER, // Variable de entorno para el usuario
    password: process.env.MYSQLPASSWORD, // Variable de entorno para la contraseña
    database: process.env.MYSQLDATABASE, // Variable de entorno para el nombre de la base de datos
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Crear un pool de conexiones
const pool = mysql.createPool(dbConfig);

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index_updated.html');
});

// Ruta para registrar un usuario
app.post('/submit', async (req, res) => {
    const { nombre, apellido, cedula, email, password, telefono, ciudad, fechaNacimiento, genero } = req.body;

    // Mapea el valor del campo 'ciudad' del formulario al ID correspondiente
    const ciudadId = 'CIU025'; // ID correspondiente a Quito

    try {
        const connection = await pool.getConnection(); // Obtener una conexión del pool
        try {
            await connection.beginTransaction();

            // Insertar datos en la tabla USUARIO
            const usuarioQuery = `
                INSERT INTO usuario (USR_EMAIL, USR_PASSWORD, ROL_ID) 
                VALUES (?, ?, ?)
            `;
            await connection.query(usuarioQuery, [
                email,
                password,
                'ROL001' // Rol predeterminado
            ]);

            // Insertar datos en la tabla CLIENTE
            const clienteQuery = `
                INSERT INTO CLIENTE (CIU_ID, USR_EMAIL, CLI_NOMBRE, CLI_APELLIDO, CLI_CEDULA, CLI_fechaNacimiento, CLI_GENERO, CLI_TELEFONO) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
            await connection.query(clienteQuery, [
                ciudadId,   // Usar el ID correcto
                email,      // Relación con la tabla USUARIO
                nombre,
                apellido,
                cedula,      // Insertar la cédula
                fechaNacimiento,
                genero,     // Valor abreviado, como 'M' o 'F'
                telefono
            ]);

            // Confirmar la transacción
            await connection.commit();

            res.send({ message: 'Usuario y cliente registrados con éxito' });
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release(); // Liberar la conexión al pool
        }
    } catch (err) {
        console.error('Error en la ruta /submit:', err);
        res.status(500).send({ message: 'Error registrando usuario y cliente', error: err.message });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en: http://localhost:${PORT}`);
});
