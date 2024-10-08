
export default class ReclamosEstadosControlador {
    constructor() {
        this.reclamosEstadosServicios = new this.reclamosEstadosServicios();
    }

    //crea estado de reclamo
    crear = async (req, res) => {
        try {
            const { descripcion, activo } = req.body;
    
            /*
            if (!descripcion) {
                return res.status(404).json({
                    mensaje: "Falta el campo descripcion."
                })
            }
            //if (!activo) { //no es adecuado, si se pasara "0" se evaluaria como verdadero (falsy negado)
            if (activo===undefined || activo===null) {
                return res.status(404).json({
                    mensaje: "Falta el campo activo."
                })
            }
            */
            //if (!descripcion || !activo) {
            if (!descripcion || activo === undefined || activo === null) {
                return res.status(400).json({
                    mensaje: "Falta/n campo/s."
                })
            }
            
            const reclamoEstado={
                descripcion:descripcion,
                activo:activo
            }            

            //const [resultado] = await conexion.query(consultaSql, [descripcion, activo]);
            const [resultado] = await this.reclamosEstadosServicios.crear(reclamoEstado);

            if (resultado.affectedRows === 0) {
                return res.status(404).json({
                    mensaje: "No se pudo crear."
                });
            }
            //puedo usar resultado.insertId para ya traerme/verificar/mostrar la entrada creada
    
            //res.status(200).json(resultado);
            res.status(200).json({
                mensaje: "Estado de Reclamo creado."
            });
        } catch (err) {
            res.status(500).json({
                mensaje: "Error"
            });
        };
    };

    actualizar = async (req, res) => {
        try {
            //const reclamoEstado= req.body;
            const { descripcion, activo } = req.body;
            const idReclamoEstado= req.params.idReclamoEstado;

            /*
            if (!descripcion) {
                return res.status(404).json({
                    mensaje: "Falta el campo descripcion."
                })
            }
            //if (!activo) { //no es adecuado, si se pasara "0" se evaluaria como verdadero (falsy negado)
            if (activo===undefined || activo===null) {
                return res.status(404).json({
                    mensaje: "Falta el campo activo."
                })
            }
            */
            //if (!descripcion || !activo) {
            if (!descripcion || activo === undefined || activo === null) {
                return res.status(404).json({
                    mensaje: "Falta/n campo/s."
                })
            }

            const datos = {
                descripcion: descripcion,
                activo: activo
            }
            const resultado = await this.reclamosEstadosServicios.actualizar(idReclamoEstado, datos); //como hace una modificacion, me trae metadata sobre los cambios de columnas, etc

            if (resultado.affectedRows === 0) {
                res.status(404).json({
                    mensaje: "No se pudo modificar."
                });
            }

            //res.status(200).json(resultado);
            res.status(200).json({
                mensaje: "Estado de Reclamo modificado."
            });

        } catch (err) {
            res.status(500).json({
                mensaje: "Error"
            });
        };
    };

    buscarTodos = async (req, res) => {
        try {
            //con los corchetes "desestructuro" la informacion, quedandome asi los datos sin la metadata de la consulta hecha
            const [resultado] = await this.reclamosEstadosServicios.buscarTodos();

            //res.status(200).send({'estado':true});//alternativa?
            //res.status(200).json({ estado: true, data: resultado});
            res.status(200).json(resultado);

        } catch (err) {
            res.status(500).json({
                mensaje: "Error"
            });
        };
    };

    buscarPorId = async (req, res) => {
        try {
            const id = req.params.idEstadoReclamo;

            const resultado= await this.reclamosEstadosServicios.buscarPorId(id);

            if (resultado.length === 0) {
                res.status(500).json({
                    mensaje: "No se encontro resultado/s."
                });
            } else {
                res.status(200).json(resultado);
            }
        } catch (err) {
            res.status(500).json({
                mensaje: "Error"
            });
        };
    };

    eliminar = async (req, res) => {
        const id = req.params.idEstadoReclamo;

        if (!id || !this.buscarPorId(id)) {
            res.status(404).json({
                mensaje: "Id recibido no valido"
            });
        }
        try {
            const resultado= await this.reclamosEstadosServicios.eliminar(id);

            if (resultado.affectedRows === 0) {
                res.status(404).json({
                    mensaje: "No se pudo eliminar."
                });
            }
            res.status(204).json({
                mensaje: `Reclamo ${id} eliminado.`
            });

        } catch (err) {
            res.status(500).json({
                mensaje: "Error"
            });
        };
    };
}