const dbConnection = require('../config/dbConfig');

// Obtener todos los tipos de reclamos
exports.getAllReclamoTipos = async (req, res) => {
    try {
        const connection = await dbConnection.getConnection();
        const [rows] = await connection.query('SELECT * FROM reclamostipo');
        connection.release();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los tipos de reclamos' });
    }
};

// Obtener un tipo de reclamo por ID
exports.getReclamoTipoById = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await dbConnection.getConnection();
        const [rows] = await connection.query('SELECT * FROM reclamostipo WHERE idReclamoTipo = ?', [id]);
        connection.release();
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el tipo de reclamo' });
    }
};

// Crear un nuevo tipo de reclamo
exports.createReclamoTipo = async (req, res) => {
    try {
        const nuevoReclamoTipo = req.body;
        const connection = await dbConnection.getConnection();
        const [results] = await connection.query('INSERT INTO reclamostipo SET ?', nuevoReclamoTipo);
        connection.release();
        res.json({ message: 'Tipo de reclamo creado correctamente', id: results.insertId });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el tipo de reclamo' });
    }
};

// Actualizar un tipo de reclamo existente
exports.updateReclamoTipo = async (req, res) => {
    try {
        const { id } = req.params;
        const datosAActualizar = req.body;
        const connection = await dbConnection.getConnection();
        await connection.query('UPDATE reclamostipo SET ? WHERE idReclamoTipo = ?', [datosAActualizar, id]);
        connection.release();
        res.json({ message: 'Tipo de reclamo actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el tipo de reclamo' });
    }
};

// Eliminar un tipo de reclamo por ID
exports.deleteReclamoTipo = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await dbConnection.getConnection();
        await connection.query('DELETE FROM reclamostipo WHERE idReclamoTipo = ?', [id]);
        connection.release();
        res.json({ message: 'Tipo de reclamo eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el tipo de reclamo' });
    }
};
