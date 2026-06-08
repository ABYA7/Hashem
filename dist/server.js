const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./database');
const path = require('path');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Servir archivos estáticos (frontend)
app.use('/diccionario', express.static(path.join(__dirname, 'rabi_module')));

// Middleware de autenticación JWT
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.status(401).json({ error: "Acceso denegado. Se requiere token." });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: "Token inválido o expirado." });
        req.user = user;
        next();
    });
}

// ==========================================
// RUTAS DE USUARIOS (Auth)
// ==========================================

// Registro
app.post('/api/usuarios/registro', async (req, res) => {
    try {
        const { nombre, email, password } = req.body;
        
        // Verificar si el email ya existe
        const userExists = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: "El email ya está registrado." });
        }

        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Guardar en DB
        const newUser = await db.query(
            'INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3) RETURNING id, nombre, email',
            [nombre, email, hashedPassword]
        );

        res.status(201).json(newUser.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error en el servidor." });
    }
});

// Login
app.post('/api/usuarios/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(400).json({ error: "Credenciales inválidas." });
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            return res.status(400).json({ error: "Credenciales inválidas." });
        }

        // Generar Token
        const token = jwt.sign({ id: user.rows[0].id, email: user.rows[0].email }, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.json({ token, usuario: { id: user.rows[0].id, nombre: user.rows[0].nombre } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error en el servidor." });
    }
});

// ==========================================
// RUTAS DE NOTAS (Estudios)
// ==========================================

// Obtener todas las notas del usuario autenticado
app.get('/api/notas', authenticateToken, async (req, res) => {
    try {
        const notas = await db.query('SELECT * FROM notas WHERE usuario_id = $1 ORDER BY fecha_creacion DESC', [req.user.id]);
        res.json(notas.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al obtener las notas." });
    }
});

// Crear o actualizar la nota principal (para este MVP, asumiremos una sola nota grande)
app.post('/api/notas', authenticateToken, async (req, res) => {
    try {
        const { contenido } = req.body;
        const usuario_id = req.user.id;

        // Buscar si ya tiene una nota "Estudio Principal"
        const existingNote = await db.query("SELECT * FROM notas WHERE usuario_id = $1 AND titulo = 'Estudio Principal'", [usuario_id]);

        if (existingNote.rows.length > 0) {
            // Actualizar
            await db.query("UPDATE notas SET contenido = $1 WHERE id = $2", [contenido, existingNote.rows[0].id]);
            res.json({ message: "Nota actualizada correctamente" });
        } else {
            // Crear
            await db.query("INSERT INTO notas (usuario_id, titulo, contenido) VALUES ($1, 'Estudio Principal', $2)", [usuario_id, contenido]);
            res.json({ message: "Nota creada correctamente" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al guardar la nota." });
    }
});

// ==========================================
// INICIAR SERVIDOR
// ==========================================
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    console.log(`Servidor de HASHEM PRO ejecutándose en http://localhost:${PORT}`);
    // Inicializar base de datos al arrancar
    await db.initDB();
});
