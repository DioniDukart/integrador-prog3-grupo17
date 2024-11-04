import ReclamosTiposServicios from "../servicios/reclamosTiposServicios.js";

export default class ReclamosTiposControlador {
    constructor() {
        this.reclamosTiposServicios = new ReclamosTiposServicios();
    }

    // Buscar todos los tipos de reclamos activos
    buscarTodos = async (req, res) => {
        try {
            const reclamosTipos = await this.reclamosTiposServicios.buscarTodos();
            res.status(200).json(reclamosTipos);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Buscar un tipo de reclamo por ID
    buscarPorId = async (req, res) => {
        try {
            const id = req.params.id;
            const reclamoTipo = await this.reclamosTiposServicios.buscarPorId(id);

            res.status(200).json(reclamoTipo);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Crear un nuevo tipo de reclamo
    crear = async (req, res) => {
        try {
            const nuevoReclamoTipo = await this.reclamosTiposServicios.crear(req.body);
            res.status(201).json(nuevoReclamoTipo);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Actualizar un tipo de reclamo por ID
    actualizar = async (req, res) => {
        try {
            const id = req.params.id;
            const reclamoTipoActualizado = await this.reclamosTiposServicios.actualizar(id, req.body);
            res.status(200).json(reclamoTipoActualizado);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    /*
    // Actualizar parcialmente un tipo de reclamo por ID
    actualizarParcialmente(req, res)=> {
        try {
            const id = req.params.id;
            const datosActualizados = req.body;
            const reclamoTipoActualizado = await this.reclamosTiposServicios.actualizarParcialmente(id, datosActualizados);
            res.status(200).json(reclamoTipoActualizado);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    */
    // Desactivar un tipo de reclamo
    desactivar = async (req, res) => {
        try {
            const id = req.params.id;
            const res = this.reclamosTiposServicios.desactivar(id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }


    // Eliminar un tipo de reclamo por ID
    eliminar = async (req, res) => {
        const id = req.params.idReclamoTipo;
    
        if (!id || !await this.buscarPorId(id)) {
            return res.status(404).json({
                mensaje: "Id recibido no válido"
            });
        }
    
        try {
            const resultado = await this.reclamosServicios.eliminar(id);
    
            if (resultado.affectedRows === 0) {
                return res.status(404).json({
                    mensaje: "No se pudo eliminar."
                });
            }
    
            res.status(204).json({
                mensaje: `Reclamo tipo ${id} eliminado.`
            });
    
        } catch (error) {
            res.status(500).json({
                mensaje: "Error en el servidor."
            });
        }
    }
    




}


//Falta testear