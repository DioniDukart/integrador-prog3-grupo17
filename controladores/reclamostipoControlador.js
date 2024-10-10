import ReclamoTipoServicio from '../servicios/reclamoTipoServicio.js';

class ReclamoTipoControlador {
    constructor() {
        this.reclamoTipoServicio = new ReclamoTipoServicio();
    }

    // Buscar todos los tipos de reclamos activos
    async buscarTodos(req, res) {
        try {
            const reclamosTipos = await this.reclamoTipoServicio.buscarTodos();
            res.status(200).json(reclamosTipos);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Buscar un tipo de reclamo por ID
    async buscarPorId(req, res) {
        try {
            const id = req.params.id;
            const reclamoTipo = await this.reclamoTipoServicio.buscarPorId(id);
            res.status(200).json(reclamoTipo);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Crear un nuevo tipo de reclamo
    async crear(req, res) {
        try {
            const nuevoReclamoTipo = await this.reclamoTipoServicio.crear(req.body);
            res.status(201).json(nuevoReclamoTipo);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Actualizar un tipo de reclamo por ID
    async actualizar(req, res) {
        try {
            const id = req.params.id;
            const reclamoTipoActualizado = await this.reclamoTipoServicio.actualizar(id, req.body);
            res.status(200).json(reclamoTipoActualizado);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Actualizar parcialmente un tipo de reclamo por ID
    async actualizarParcialmente(req, res) {
        try {
            const id = req.params.id;
            const datosActualizados = req.body;
            const reclamoTipoActualizado = await this.reclamoTipoServicio.actualizarParcialmente(id, datosActualizados);
            res.status(200).json(reclamoTipoActualizado);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Eliminar (desactivar) un tipo de reclamo
    async eliminar(req, res) {
        try {
            const id = req.params.id;
            await this.reclamoTipoServicio.eliminar(id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default ReclamoTipoControlador;
