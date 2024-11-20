import OficinasServicios from "../servicios/oficinasServicios.js";

export default class OficinasControlador {
    constructor() {
        this.oficinasServicios = new OficinasServicios();
    }

    // Crea nueva oficina
    crear = async (req, res) => {
        try {
            const { nombre, idReclamoTipo, activo } = req.body;

            // Verifico
            if (!nombre || !idReclamoTipo || activo === undefined) {
                return res.status(400).json({
                    mensaje: "Falta/n parámetro/s"
                });
            }

            const oficina = {
                nombre: nombre,
                idReclamoTipo: idReclamoTipo,
                activo: activo
            };

            const resultado = await this.oficinasServicios.crear(oficina);

            if (resultado.affectedRows === 0) {
                return res.status(404).json({
                    mensaje: "No se pudo crear."
                });
            }

            res.status(201).json({
                mensaje: "Oficina creada",
                idOficina: resultado.insertId
            });
        } catch (err) {
            res.status(500).json({
                mensaje: "Error al crear"
            });
        }
    };

    // Consultar todas las oficinas
    buscarTodas = async (req, res) => {
        try {
            const resultado = await this.oficinasServicios.buscarTodas();

            if (resultado.length === 0) {
                return res.status(404).json({
                    mensaje: "No se encontraron resultados."
                });
            }

            res.status(200).json(resultado);
        } catch (err) {
            res.status(500).json({
                mensaje: "Error al buscar oficinas."
            });
        }
    };

    // Consulta por ID
    buscarPorId = async (req, res) => {
        const id = req.params.idOficina;

        if (!id) {
            return res.status(400).json({ mensaje: "El parámetro no puede ser vacío." });
        }

        try {
            const resultado = await this.oficinasServicios.buscarPorId(id);

            if (!resultado) {
                return res.status(404).json({
                    mensaje: "No se encontró"
                });
            }

            res.status(200).json(resultado);
        } catch (err) {
            res.status(500).json({
                mensaje: "Error al buscar"
            });
        }
    };

    // Actualizar
    actualizar = async (req, res) => {
        const id = req.params.idOficina;
        const cuerpo = req.body;

        if (!id) {
            return res.status(400).json({ mensaje: "El parámetro no puede ser vacío." });
        }

        try {
            const resultado = await this.oficinasServicios.actualizar(id, cuerpo);

            if (resultado.affectedRows === 0) {
                return res.status(404).json({
                    mensaje: "No se pudo actualizar"
                });
            }

            res.status(204).send();
        } catch (err) {
            res.status(500).json({
                mensaje: "Error al actualizar"
            });
        }
    };

    // Eliminar
    eliminar = async (req, res) => {
        const id = req.params.idOficina;

        if (!id) {
            return res.status(400).json({ mensaje: "El parámetro no puede ser vacío." });
        }

        try {
            const resultado = await this.oficinasServicios.eliminar(id);

            if (resultado.affectedRows === 0) {
                return res.status(404).json({
                    mensaje: "No se pudo eliminar la oficina."
                });
            }

            res.status(204).send(resultado);
        } catch (err) {
            res.status(500).json({
                mensaje: "Error al eliminar la oficina."
            });
        }
    };

    // Agregar un empleado a una oficina
    agregarEmpleado = async (req, res) => {
        const idOficina = req.params.idOficina;
        const { idUsuario } = req.body;
        //console.log("agregarEmpleado en oficinasControlador ", idOficina, " ", idUsuario);
        if (!idOficina || !idUsuario) {
            return res.status(400).json({ mensaje: "Faltan parámetros" });
        }

        try {
            const ocupado = await this.oficinasServicios.tieneOficina(idUsuario);
            /*
            if (ocupado.affectedRows !== 0) {
                return res.status(400).json({
                    mensaje: "El empleado ya tiene otra oficina asignada."
                });
            }
            */
            console.log(ocupado);
            if (ocupado.length > 0) {
                return res.status(400).json({
                    mensaje: "El empleado ya tiene otra oficina asignada."
                });
            }
            const resultado = await this.oficinasServicios.agregarEmpleado(idUsuario, idOficina);
            res.status(200).json(resultado);
        } catch (error) {
            //console.error("error en agregarEmpleado " + error);
            res.status(500).json({ mensaje: "Error al agregar el empleado a la oficina" });
        }
    };

    // Quitar un empleado de una oficina
    quitarEmpleado = async (req, res) => {
        const idOficina = req.params.idOficina;
        const { idUsuario } = req.body;

        if (!idOficina || !idUsuario) {
            return res.status(400).json({ mensaje: "Faltan parámetros" });
        }

        try {
            const ocupado = await this.oficinasServicios.tieneOficina(idUsuario);
            if (ocupado.affectedRows == 0) {
                return res.status(400).json({
                    mensaje: "El empleado no tiene oficina asignada."
                });
            }
            const resultado = await this.oficinasServicios.quitarEmpleado(idOficina, idUsuario);
            res.status(200).json(resultado);
        } catch (error) {
            console.error(error);
            res.status(500).json({ mensaje: "Error al quitar el empleado de la oficina" });
        }
    };

}