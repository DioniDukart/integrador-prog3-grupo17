import ReclamosServicios from "../servicios/reclamosServicios.js";
import UsuariosOficinasBD from "../bd/usuariosOficinasBD.js";

export default class ReclamosControlador {

    constructor() {
        this.reclamosServicios = new ReclamosServicios();
        this.usuariosOficinasBD = new UsuariosOficinasBD();
    }

    //crea reclamo
    crear = async (req, res) => {
        try {
            const { asunto, descripcion, idReclamoTipo/*, idUsuarioFinalizador*/ } = req.body;
            const idUsuario = req.user.idUsuario;

            //verifico requeridos
            if (!asunto || !idReclamoTipo || !idUsuario) {
                return res.status(404).json({
                    mensaje: "Falta/n parametro/s."
                })
            }

            //VER COMO HACER "fechaCreado" -> se hace en servicio
            const reclamo = {
                asunto: asunto,
                descripcion: descripcion,
                idReclamoTipo: idReclamoTipo,
                idUsuarioCreador: idUsuario,
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

    buscarReclamosUsuario= async (req, res) => {
        const idUsuario = req.user.idUsuario;
        try {
            const resultado = await this.reclamosServicios.buscarReclamosUsuario(idUsuario);

            if (resultado.length === 0) {
                res.status(500).json({
                    mensaje: "No se encontraron resultados de Reclamos."
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

    //consulta todos
    buscarTodos = async (req, res) => {
        try {
            const resultado = await this.reclamosServicios.buscarTodos();

            if (resultado.length === 0) {
                res.status(500).json({
                    mensaje: "No se encontraron resultados de Reclamos."
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

        if (id === null || id === undefined) {
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
            const resultado = await this.reclamosServicios.eliminar(id);

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

    atenderReclamo = async (req, res) => {
        try {
            const idReclamo = req.params.idReclamo;
            const idReclamoEstado = req.body.idReclamoEstado;
            console.log("idReclamoEstado: ", idReclamo);
            console.log("idReclamoEstado: ", idReclamoEstado);
            if (idReclamoEstado === undefined) {
                return res.status(400).send({
                    estado: "Falla",
                    mensaje: "Falta el id del estado de reclamo."
                })
            }

            if (idReclamoEstado < 2 || idReclamoEstado == 3 || idReclamoEstado > 4) {//que no permanezca como "creado(1), como cancelado(3) sin llamar a cancelarReclamo, o fuera de rango"
                //basicamente solo sigue si es 2 o 4
                //seria mejor llamar a otros metodos segun idReclamoEstado? Seria mas flexible ej: atenderEnProceso(), atenderCancelar(), atenderFinalizar(), etc 
                return res.status(400).send({
                    estado: "Falla",
                    mensaje: "Id del estado de reclamo invalido."
                })
            }

            //Controlar la pertenencia a la misma oficina entre usuario y reclamo? Token? Como se quien es el usuario? req.user?
            //Averiguo el idOficina buscando en usuarios-oficinas la que tenga el idUsuario, el cual saco del token
            //Luego verifico el idReclamoTipo de la misma oficina
            //Finalmente veo si el idReclamoTipo de la oficina, es el mismo idReclamoTipo del Reclamo
            /*
            //{"idUsuario": 16,  "usuario": "Dionisio Dukart",  "idTipoUsuario"=1}
            */
            const coincidencia= await this.reclamosServicios.coincidenciaReclamoOficina(req.user.idUsuario, idReclamo);//trae true o  false
            console.log("coincidencia: ", coincidencia);
            //if(req.user.idUsuario==oficina.) 
            if(!coincidencia){
                return res.status(400).send({
                    estado: "Falla",
                    mensaje: "El tipo del reclamo no pertenece a la oficina del empleado."
                })
            }
            

            let dato = {
                idReclamoEstado
            }


            if (idReclamoEstado == 4) {//si es finalizado, creo su fecha
                //console.log("Entramos a id if 4");
                const fechaFinalizado = new Date().toISOString().slice(0, 19).replace('T', ' ');
                dato.fechaFinalizado = fechaFinalizado;//y la agrego al objeto dato
               // console.log("Fecha Finalizado: ", fechaFinalizado);
            }

            //console.log("dato: ", dato);
            const reclamoModificado = await this.reclamosServicios.notificarCambio(idReclamo, dato);

            if (reclamoModificado.estado) {
                res.status(200).send({ estado: "OK", mensaje: reclamoModificado.mensaje });
            } else {
                res.status(404).send({ estado: "Falla", mensaje: reclamoModificado.mensaje });
            }

        } catch (error) {
            res.status(500).send({
                estado: "Falla", mensaje: "Error interno en servidor.", error:error
            });
        }
    }
    
    cancelarReclamo = async (req, res) => {
        try {
            const idReclamo = req.params.idReclamo;

            // verificar que se reciba el idReclamo
            if (idReclamo === undefined) {
                return res.status(400).send({
                    estado: "Falla",
                    mensaje: "Falta el id del reclamo."
                })
            }

            //creo objeto con id de "cancelado" y la fecha actual
            const dato = {
                idReclamoEstado: 3,
                fechaCancelado: new Date().toISOString().slice(0, 19).replace('T', ' ')  // yyyy-mm-dd hh:mm:ss
            };


            const reclamoCancelado = await this.reclamosServicios.cancelarReclamo(idReclamo, dato);

            if (reclamoCancelado.estado) {
                res.status(200).send({ estado: "OK", mensaje: reclamoCancelado.mensaje });
            } else {
                res.status(404).send({ estado: "Falla", mensaje: reclamoCancelado.mensaje });
            }
        } catch (error) {
            res.status(500).send({
                estado: "Falla", mensaje: "Error interno en servidor.", error:error
            });
        }
        

    }
    
    /*
    atenderReclamo = async (req, res) => {
        try {
            const idReclamo = req.params.idReclamo;
            const idReclamoEstado = req.body.idReclamoEstado;
            const idUsuario = req.user.id; // ID del usuario autenticado (asumimos que viene de la sesión o JWT)

            if (idReclamoEstado === undefined) {
                return res.status(400).send({
                    estado: "Falla",
                    mensaje: "Falta el id del estado de reclamo."
                });
            }

            // 1. Obtener la oficina del usuario (empleado)
            const oficinaUsuario = await this.usuariosOficinasBD.obtenerOficinaUsuario(idUsuario);
            if (!oficinaUsuario) {
                return res.status(403).json({ mensaje: "No tienes una oficina asignada." });
            }

            // 2. Verificar que el reclamo pertenece a la oficina del usuario
            const reclamo = await this.reclamosServicios.buscarPorId(idReclamo);
            if (!reclamo) {
                return res.status(404).json({ mensaje: "Reclamo no encontrado." });
            }

            if (reclamo.idOficina !== oficinaUsuario) {
                return res.status(403).json({ mensaje: "No puedes atender reclamos de otra oficina." });
            }

            // 3. Actualizar el estado del reclamo
            const dato = { idReclamoEstado };
            const reclamoModificado = await this.reclamosServicios.notificarCambio(idReclamo, dato);

            if (reclamoModificado.estado) {
                res.status(200).send({ estado: "OK", mensaje: reclamoModificado.mensaje });
            } else {
                res.status(404).send({ estado: "Falla", mensaje: reclamoModificado.mensaje });
            }

        } catch (error) {
            res.status(500).send({
                estado: "Falla", mensaje: "Error interno en servidor."
            });
        }
    }
        */
    informe = async (req, res) => {

        try{
            const formato = req.query.formato;
            if(!formato || !formatosPermitidos.includes(formato)){
                return res.status(400).send({
                    estado:"Falla",
                    mensaje: "Formato inválido para el informe."    
                })
            }
            
            // genera informe
            const {buffer, path, headers} = await this.reclamosServicios.generarInforme(formato);

            // configura cabecera de respuesta 
            res.set(headers)

            if (formato === 'pdf') {
                // respuesta a cliente  
                res.status(200).end(buffer);
            } else if (formato === 'csv') {
                // respuesta a cliente
                res.status(200).download(path, (err) => {
                    if (err) {
                        return res.status(500).send({
                            estado:"Falla",
                            mensaje: " No se pudo generar el informe."    
                        })
                    }
                })
            }
        }catch(error){
            console.log(error)
            res.status(500).send({
                estado:"Falla", mensaje: "Error interno en servidor."
            });
        } 
    }

}
