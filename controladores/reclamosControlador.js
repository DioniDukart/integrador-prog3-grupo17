import ReclamosServicios from "../servicios/reclamosServicios.js";
import UsuariosOficinasBD from "../bd/usuariosOficinasBD.js";
const formatosPermitidos = ['pdf', 'csv'];


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

    buscarReclamosUsuario = async (req, res) => {
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

    buscarReclamosOficina = async (req, res) => {
        const idUsuario = req.user.idUsuario;
        //buscar el tipo de su oficina
        //a partir de mi id, buscar la oficina a la que pertenezco, y obtengo su idReclamoTipo
        const idReclamoTipo = await this.reclamosServicios.obtenerTipoReclamoPorUsuario(idUsuario);
        if (!idReclamoTipo) {
            res.status(500).json({
                mensaje: "No se encontro el tipo de reclamo de la oficina del empleado."
            });
        };

        try {
            const resultado = await this.reclamosServicios.buscarReclamosOficina(idReclamoTipo.idReclamoTipo);
            if (resultado.length === 0) {
                res.status(500).json({
                    mensaje: "No se encontraron resultados de Reclamos del tipo de la oficina del empleado."
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
    /*
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
    */


    //consulta todos CON PAGINACION
    buscarTodos = async (req, res) => {
        // console.log(req.user)

        //Paginación
        const limit = req.query.limit;
        const offset = req.query.offset;

        try {
            //Si no están definidos limit y offset no hago paginación
            let pLimit = limit ? Number(limit) : 0;
            let pOffset = offset ? Number(offset) : 0;

            const reclamos = await this.reclamosServicios.buscarTodos(pLimit, pOffset);
            res.status(200).send(
                { estado: 'OK', data: reclamos }
            );

        } catch (error) {
            res.status(500).send({
                estado: "Falla", mensaje: "Error interno en servidor."
            });
        }
    }


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
            const idReclamoEstado = req.body.idReclamoEstado; //el nuevo estado de reclamo recibido por cuerpo de solicitud
            const idUsuario = req.user.idUsuario;

            if (idReclamoEstado === undefined) {
                return res.status(400).send({
                    estado: "Falla",
                    mensaje: "Falta el id del estado de reclamo."
                })
            }

            const reclamo = await this.reclamosServicios.buscarPorId(idReclamo);
            if (reclamo.idReclamoEstado == 2 || reclamo.idReclamoEstado == 4) {
                return res.status(400).send({
                    estado: "Falla",
                    mensaje: "El reclamo del id recibido ya se encuentra cancelado o finalizado."
                })
            }

            if (idReclamoEstado < 2 || idReclamoEstado == 3 || idReclamoEstado > 4) {//que no permanezca como "creado(1), como cancelado(3) sin llamar a cancelarReclamo, o fuera de rango"
                //basicamente solo sigue si es 2 o 4 (idReclamoEstado!==2 || idReclamoEstado!==4)
                //seria mejor llamar a otros metodos segun idReclamoEstado? Seria mas flexible ej: atenderEnProceso(), atenderCancelar(), atenderFinalizar(), etc 
                return res.status(400).send({
                    estado: "Falla",
                    mensaje: "Id del estado de reclamo invalido."
                })
            }

            //Averiguo el idOficina buscando en usuarios-oficinas la que tenga el idUsuario, el cual saco del token
            //Luego verifico el idReclamoTipo de la misma oficina
            //Finalmente veo si el idReclamoTipo de la oficina, es el mismo idReclamoTipo del Reclamo
            const coincidencia = await this.reclamosServicios.coincidenciaReclamoOficina(idUsuario, idReclamo);//trae true o  false
            //console.log("coincidencia: ", coincidencia);
            if (!coincidencia) {
                return res.status(400).send({
                    estado: "Falla",
                    mensaje: "El tipo del reclamo no pertenece a la oficina del empleado."
                })
            }

            let dato = {
                idReclamoEstado
            }

            if (idReclamoEstado == 4) {//si es finalizado 
                const fechaFinalizado = new Date().toISOString().slice(0, 19).replace('T', ' '); //creo fecha
                dato.fechaFinalizado = fechaFinalizado;//la agrego al objeto dato
                dato.idUsuarioFinalizador = idUsuario;//y agrego el id de usuario finalizador sacado del token
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
                estado: "Falla", mensaje: "Error interno en servidor.", error: error
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
                estado: "Falla", mensaje: "Error interno en servidor.", error: error
            });
        }
    }


    informe = async (req, res) => {
        try {
            const formato = req.query.formato;
            if (!formato || !formatosPermitidos.includes(formato)) {
                return res.status(400).send({
                    estado: "Falla",
                    mensaje: "Formato inválido para el informe."
                })
            }

            // genera informe
            const { buffer, path, headers } = await this.reclamosServicios.generarInforme(formato);

            // configura cabecera de respuesta 
            res.set(headers);

            if (formato === 'pdf') {
                // respuesta a cliente
                res.status(200).end(buffer);
            } else if (formato === 'csv') {
                // respuesta a cliente
                res.status(200).download(path, (err) => {
                    if (err) {
                        return res.status(500).send({
                            estado: "Falla",
                            mensaje: " No se pudo generar el informe."
                        })
                    }
                });
            }
        } catch (error) {
            console.log(error)
            res.status(500).send({
                estado: "Falla", mensaje: "Error interno en servidor."
            });
        }
    }

    buscarEstadisticasReclamos = async (req, res) => {
        try {
            // Llamamos al servicio que obtiene las estadísticas
            const estadisticas = await this.reclamosServicios.buscarEstadisticasReclamos();

            if (Object.keys(estadisticas).length === 0) {
                return res.status(404).json({
                    mensaje: "No se encontraron estadísticas de reclamos."
                });
            }

            // Enviamos los resultados de las estadísticas en formato JSON
            res.status(200).json(estadisticas);
        } catch (err) {
            console.error("Error al obtener estadísticas de reclamos:", err);
            res.status(500).json({
                mensaje: "Error interno al obtener las estadísticas de reclamos."
            });

        }
    }

}