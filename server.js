const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const cors = require('cors');
const PORT = process.env.PORT || 5001;
const app = express();

// Use CORS middleware
app.use(cors({
    origin: 'http://localhost:5001'
}));

// Sirve archivos estáticos desde la carpeta "public"
app.use(express.static('public'));

// Middleware para parsear JSON
app.use(bodyParser.json());

// Configuración de la conexión a MySQL
const dbConfig = {
    host: 'localhost', // Cambia si usas un servidor remoto
    user: 'elite_user', // Usuario de la base de datos
    password: 'mi_contraseña', // Contraseña del usuario
    database: 'eliteagro', // Nombre de la base de datos
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Crear un pool de conexiones
const pool = mysql.createPool(dbConfig);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index_updated.html');
});


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
                INSERT INTO USUARIO (USR_EMAIL, USR_PASSWORD, ROL_ID) 
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

//app.listen(3000, '172.16.1.73', () => {
//    console.log('Servidor escuchando en http://172.16.1.73:3000');
//});