/**
 * Índice de Modelos - Relaciones entre tablas
 * 
 * Estructura jerárquica:
 * Biblia → Libro → Capítulo → Versículo
 *                                ├── ReferenciaCruzada
 *                                ├── Comentario
 *                                └── Nota (usuario)
 * 
 * Tablas independientes: Diccionario, Imagen, Mapa, Usuario
 */

const Biblia = require('./Biblia');
const Libro = require('./Libro');
const Capitulo = require('./Capitulo');
const Versiculo = require('./Versiculo');
const Diccionario = require('./Diccionario');
const Usuario = require('./Usuario');
const Nota = require('./Nota');
const Imagen = require('./Imagen');
const Mapa = require('./Mapa');
const ReferenciaCruzada = require('./ReferenciaCruzada');
const Comentario = require('./Comentario');

// ══════════════════════════════════════════════════════════
// RELACIONES JERÁRQUICAS
// ══════════════════════════════════════════════════════════

// Biblia → Libros
Biblia.hasMany(Libro, { foreignKey: 'biblia_id', as: 'libros' });
Libro.belongsTo(Biblia, { foreignKey: 'biblia_id', as: 'biblia' });

// Libro → Capítulos
Libro.hasMany(Capitulo, { foreignKey: 'libro_id', as: 'capitulos' });
Capitulo.belongsTo(Libro, { foreignKey: 'libro_id', as: 'libro' });

// Capítulo → Versículos
Capitulo.hasMany(Versiculo, { foreignKey: 'capitulo_id', as: 'versiculos' });
Versiculo.belongsTo(Capitulo, { foreignKey: 'capitulo_id', as: 'capitulo' });

// Atajos directos para consultas rápidas
Biblia.hasMany(Versiculo, { foreignKey: 'biblia_id', as: 'todosVersiculos' });
Versiculo.belongsTo(Biblia, { foreignKey: 'biblia_id', as: 'biblia' });
Libro.hasMany(Versiculo, { foreignKey: 'libro_id', as: 'todosVersiculos' });
Versiculo.belongsTo(Libro, { foreignKey: 'libro_id', as: 'libro' });

// ══════════════════════════════════════════════════════════
// REFERENCIAS CRUZADAS
// ══════════════════════════════════════════════════════════
Versiculo.hasMany(ReferenciaCruzada, { foreignKey: 'versiculo_origen_id', as: 'referenciasDesde' });
Versiculo.hasMany(ReferenciaCruzada, { foreignKey: 'versiculo_destino_id', as: 'referenciasHacia' });
ReferenciaCruzada.belongsTo(Versiculo, { foreignKey: 'versiculo_origen_id', as: 'origen' });
ReferenciaCruzada.belongsTo(Versiculo, { foreignKey: 'versiculo_destino_id', as: 'destino' });

// ══════════════════════════════════════════════════════════
// COMENTARIOS
// ══════════════════════════════════════════════════════════
Versiculo.hasMany(Comentario, { foreignKey: 'versiculo_id', as: 'comentarios' });
Comentario.belongsTo(Versiculo, { foreignKey: 'versiculo_id', as: 'versiculo' });
Capitulo.hasMany(Comentario, { foreignKey: 'capitulo_id', as: 'comentarios' });
Comentario.belongsTo(Capitulo, { foreignKey: 'capitulo_id', as: 'capitulo' });
Libro.hasMany(Comentario, { foreignKey: 'libro_id', as: 'comentariosIntro' });
Comentario.belongsTo(Libro, { foreignKey: 'libro_id', as: 'libro' });

// ══════════════════════════════════════════════════════════
// NOTAS DE USUARIO
// ══════════════════════════════════════════════════════════
Usuario.hasMany(Nota, { foreignKey: 'usuario_id', as: 'notas' });
Nota.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
Versiculo.hasMany(Nota, { foreignKey: 'versiculo_id', as: 'notas' });
Nota.belongsTo(Versiculo, { foreignKey: 'versiculo_id', as: 'versiculo' });

// ══════════════════════════════════════════════════════════
// IMÁGENES
// ══════════════════════════════════════════════════════════
Libro.hasMany(Imagen, { foreignKey: 'libro_id', as: 'imagenes' });
Imagen.belongsTo(Libro, { foreignKey: 'libro_id', as: 'libro' });

module.exports = {
  Biblia,
  Libro,
  Capitulo,
  Versiculo,
  Diccionario,
  Usuario,
  Nota,
  Imagen,
  Mapa,
  ReferenciaCruzada,
  Comentario
};
