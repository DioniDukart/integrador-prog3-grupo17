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
        /* 
        try {
            const id = req.params.id;
            const reclamoTipoActualizado = await this.reclamosTiposServicios.actualizar(id, req.body);
            res.status(200).json(reclamoTipoActualizado);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
        */
        try {
            const id = req.params.id;
            if (id === undefined) {
                return res.status(400).send({
                    estado: "Falla", mensaje: "No se recibio el id del Tipo de Reclamo a modificar."
                });
            }
            //const datos = req.body;
            const {descripcion} = req.body;//es mas seguro?
            if (Object.keys(datos).lenght === 0) {
                return res.status(400).send({
                    estado: "Falla", mensaje: "No se recibieron datos para modificar el Tipo de Reclamo."
                });
            }

            //const reclamoTipoActualizado = await this.reclamosTiposServicios.actualizar(id, datos);
            const reclamoTipoActualizado = await this.reclamosTiposServicios.actualizar(id, descripcion);
            if (reclamoTipoActualizado.estado) {
                res.status(200).send({ estado: "OK", mensaje: reclamoTipoActualizado.mensaje });
            } else {
                res.status(404).send({ estado: "Falla", mensaje: reclamoTipoActualizado.mensaje });
            }
        } catch (error) {
            res.status(500).send({ estado: "Falla", mensaje: "Error interno en el servidor." });
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
    // Eliminar (desactivar) un tipo de reclamo
    eliminar = async (req, res) => {
        try {
            const id = req.params.id;
            const res = this.reclamosTiposServicios.eliminar(id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}


//Falta testear