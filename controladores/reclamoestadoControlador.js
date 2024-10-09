const dbConnection = require('../config/dbConfig');

// Obtener todos los estados de reclamos
exports.getAllReclamoEstados = async (req, res) => {
    try {
        const connection = await dbConnection.getConnection();
        const [rows] = await connection.query('SELECT * FROM reclamoestado');
        connection.release();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los estados de reclamos' });
    }
};

// Obtener un estado de reclamo por ID
exports.getReclamoEstadoById = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await dbConnection.getConnection();
        const [rows] = await connection.query('SELECT * FROM reclamoestado WHERE idReclamoEstado = ?', [id]);
        connection.release();
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el estado de reclamo' });
    }
};

// Crear un nuevo estado de reclamo
exports.createReclamoEstado = async (req, res) => {
    try {
        const nuevoReclamoEstado = req.body;
        const connection = await dbConnection.getConnection();
        const [results] = await connection.query('INSERT INTO reclamoestado SET ?', nuevoReclamoEstado);
        connection.release();
        res.json({ message: 'Estado de reclamo creado correctamente', id: results.insertId });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el estado de reclamo' });
    }
};

// Actualizar un estado de reclamo existente
exports.updateReclamoEstado = async (req, res) => {
    try {
        const { id } = req.params;
        const datosAActualizar = req.body;
        const connection = await dbConnection.getConnection();
        await connection.query('UPDATE reclamoestado SET ? WHERE idReclamoEstado = ?', [datosAActualizar, id]);
        connection.release();
        res.json({ message: 'Estado de reclamo actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el estado de reclamo' });
    }
};

// Eliminar un estado de reclamo por ID
exports.deleteReclamoEstado = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await dbConnection.getConnection();
        await connection.query('DELETE FROM reclamoestado WHERE idReclamoEstado = ?', [id]);
        connection.release();
        res.json({ message: 'Estado de reclamo eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el estado de reclamo' });
    }
};
