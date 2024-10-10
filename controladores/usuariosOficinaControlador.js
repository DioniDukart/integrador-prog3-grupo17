import UsuariosOficinaServicio from '../servicios/usuariosOficinaServicio.js';

class UsuariosOficinaControlador {
    constructor() {
        this.usuariosOficinaServicio = new UsuariosOficinaServicio();
    }

    async buscarTodos(req, res) {
        try {
            const usuariosOficinas = await this.usuariosOficinaServicio.buscarTodos();
            res.status(200).json(usuariosOficinas);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async buscarPorId(req, res) {
        try {
            const id = req.params.id;
            const usuarioOficina = await this.usuariosOficinaServicio.buscarPorId(id);
            res.status(200).json(usuarioOficina);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async crear(req, res) {
        try {
            const nuevoUsuariosOficina = await this.usuariosOficinaServicio.crear(req.body);
            res.status(201).json(nuevoUsuariosOficina);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async actualizar(req, res) {
        try {
            const id = req.params.id;
            const usuarioOficinaActualizado = await this.usuariosOficinaServicio.actualizar(id, req.body);
            res.status(200).json(usuarioOficinaActualizado);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async actualizarParcialmente(req, res) {
        try {
            const id = req.params.id;
            const datosActualizados = req.body;
            const usuarioOficinaActualizado = await this.usuariosOficinaServicio.actualizarParcialmente(id, datosActualizados);
            res.status(200).json(usuarioOficinaActualizado);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async eliminar(req, res) {
        try {
            const id = req.params.id;
            await this.usuariosOficinaServicio.eliminar(id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default UsuariosOficinaControlador;
