const { Pool } = require('pg');
require('dotenv').config();

// Configuración del pool de conexiones a PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Probar conexión
pool.on('error', (err, client) => {
    console.error('Error inesperado en la base de datos', err);
    process.exit(-1);
});

// Función para inicializar las tablas si no existen (Migración)
async function initDB() {
    const client = await pool.connect();
    try {
        console.log('Verificando e inicializando tablas en PostgreSQL...');
        
        // Ejecutamos el esquema basado en tu sql.txt, con mejoras como FOREIGN KEYs
        await client.query(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                email VARCHAR(150) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL
            );

            CREATE TABLE IF NOT EXISTS biblias (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL
            );

            CREATE TABLE IF NOT EXISTS libros (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL
            );

            CREATE TABLE IF NOT EXISTS capitulos (
                id SERIAL PRIMARY KEY,
                libro_id INTEGER REFERENCES libros(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS versiculos (
                id SERIAL PRIMARY KEY,
                capitulo_id INTEGER REFERENCES capitulos(id) ON DELETE CASCADE,
                numero INTEGER NOT NULL,
                texto TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS diccionario (
                id SERIAL PRIMARY KEY,
                termino VARCHAR(255) UNIQUE NOT NULL,
                descripcion TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS notas (
                id SERIAL PRIMARY KEY,
                usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
                titulo VARCHAR(255) NOT NULL,
                contenido TEXT NOT NULL,
                fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Tablas inicializadas correctamente.');
    } catch (error) {
        console.error('Error al inicializar la base de datos:', error.message);
        console.log('Por favor, verifica que PostgreSQL esté ejecutándose y que la base de datos exista.');
    } finally {
        client.release();
    }
}

module.exports = {
    query: (text, params) => pool.query(text, params),
    initDB
};
