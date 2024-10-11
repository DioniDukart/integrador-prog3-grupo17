import ReclamosServicios from "../servicios/reclamosServicios.js";

export default class ReclamosControlador {

    constructor() {
        this.reclamosServicios = new ReclamosServicios();
    }

    //crea reclamo
    crear = async (req, res) => {
        try {
            const { asunto, descripcion, idReclamoTipo, idUsuarioCreador/*, idUsuarioFinalizador*/ } = req.body;

            //verifico requeridos
            if (!asunto || !idReclamoTipo || !idUsuarioCreador) {
                return res.status(404).json({
                    mensaje: "Falta/n parametro/s."
                })
            }

            //VER COMO HACER "fechaCreado" -> se hace en servicio
            const reclamo = {
                asunto: asunto,
                descripcion: descripcion,
                idReclamoTipo: idReclamoTipo,
                idUsuarioCreador: idUsuarioCreador
            }

            const resultado = await this.reclamosServicios.crear(reclamo);

            if (resultado.affectedRows === 0) {
                return res.status(404).json({
                    mensaje: "No se pudo crear."
                });
            }
            //puedo usar resultado.insertId para ya traerme/verificar/mostrar la entrada creada

            //res.status(200).json(resultado);
            res.status(200).json({
                mensaje: "Reclamo creado." /*post(resultado.insertId) O ,dato:resultado*/
            });

        } catch (err) {
            res.status(500).json({
                mensaje: "Error"
            });
        };
    }

    //consulta todos
    buscarTodos = async (req, res) => {
        try {
            const resultado = await this.reclamosServicios.buscarTodos();

            if (resultado.length === 0) {
                res.status(500).json({
                    mensaje: "No se encontraron resultados."
                });
            }

            res.status(200).json(resultado);
        } catch (err) {
            console.log(err);
            res.status(500).json({
                mensaje: "Error interno en el servidor."
            });
        }
    }
    
    /* 
    //consulta todos CON PAGINACION
    buscarTodos = async (req, res) => {
        //Filtros
        //const firstName = req.query.firstName;
        //const lastName = req.query.lastName;
        const id = req.query.idReclamo;

        //Paginación
        const limit = req.query.limit;
        const offset = req.query.offset;
        const order = req.query.order;
        const asc = req.query.asc;

        try {

            //Si no están definidos limit y offset no hago paginación
            let pLimit = limit ? Number(limit) : 0;
            let pOffset = offset ? Number(offset) : 0;
            //let pOrder = order || "actorId";
            let pOrder = order || "idReclamo"; //¿esto es como esta en la bd, o como se lo renombre con "AS"?
            let pAsc = asc === "false" ? false : true;

            //const data = await this.service.findAll({ firstName, lastName }, pLimit, pOffset, pOrder, pAsc);
            const data = await this.service.findAll({ id, }, pLimit, pOffset, pOrder, pAsc);

            res.send(data);

        } catch (exc) {
            res.status(500).json({
                mensaje: "Error"
            });
        }
    }
    */

    //consulta un unico segun su id
    buscarPorId = async (req, res) => {
        //console.log("Llega a BuscarPorId de reclamosControlador");
        const id = req.params.idReclamo;

        if (!id) {
            res.status(404).json({ status: "Fallo", data: { error: "El parametro no puede ser vacio." } });
        }

        try {
            /*
            const consultaSql = "SELECT * FROM reclamos WHERE activo=1 AND idReclamo=?";
            const [resultado] = await conexion.query(consultaSql, [id]);

            if (resultado.length === 0) {
                res.status(404).json({
                    mensaje: "No se encontro resultado."
                });
            }
            res.status(200).json(resultado);
             */
            const resultado = await this.reclamosServicios.buscarPorId(id);
            
            //esto me tira el servidor si result viene vacio?
            if (!resultado) {
                res.status(404).json({
                    mensaje: "No se encontro resultado."
                });
            }
            
            res.status(200).json(resultado);

        } catch (err) {
            res.status(500).json({
                mensaje: "Error"
            });
        }
    }

    //VER QUE HACER CON idUsuarioFinalizador si idReclamoEstado es 3-4 (de donde sacaria el idUsuario?,)
    actualizar = async (req, res) => {
        const id = req.params.idReclamo;

        const cuerpo = req.body;

        if (id===null || id===undefined) {
            res.status(404).json({ status: "Fallo", data: { error: "El parametro no puede ser vacio." } });
        }
        if (!this.buscarPorId(id)) {//seria mas conveniente llamar otra capa?
            res.status(404).json({ status: "Fallo", data: { error: "No existe reclamo con el id ingresado." } });
        }
        /*
        //si idReclamoEstado tiene un valor valido, verifico que sea un numero y que no este fuera del rango de valores valido
        if(cuerpo.idReclamoEstado){
            let num= Number(cuerpo.idReclamoEstado);
            if (num<1){//podria verificar que tambien sea menor a algo?
                res.status(404).json({ status: "Fallo", data: { error: "El valor para el campo estado de reclamo no es valido." } });
            }
        }
        */

        try {
            const reclamoActualizado = await this.reclamosServicios.actualizar(id, cuerpo);

            //res.status(204).send();
            res.status(204).json({
                reclamoActualizado
            });
        } catch (error) {
            res.status(500).json({
                mensaje: "Error"
            });
        }
    }

    eliminar = async (req, res) => {
        const id = req.params.idReclamo;

        if (!id || !this.buscarPorId(id)) {
            res.status(404).json({
                mensaje: "Id recibido no valido"
            });
        }

        try {
            const resultado= await this.reclamosServicios.eliminar(id);
            
            //res.status(204).send();
            if (resultado.affectedRows === 0) {
                res.status(404).json({
                    mensaje: "No se pudo eliminar."
                });
            }
            
            res.status(204).json({
                mensaje: `Reclamo ${id} eliminado.`
            });
            
        } catch (error) {
            res.status(500).json({
                mensaje: "Error"
            });
        }
    }
}