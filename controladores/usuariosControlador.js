import UsuariosServicios from "../servicios/usuariosServicios.js";
import { createHash } from "crypto";

export default class UsuariosControlador {
    constructor() {
        this.usuariosServicios = new UsuariosServicios();
    }

    //crea usuario nuevo
    crear = async (req, res) => {
        try {
            const { nombre, apellido, correoElectronico, contrasenia, idTipoUsuario, imagen } = req.body;

            //verifico requeridos
            if (!nombre || !apellido || !correoElectronico || !contrasenia || !idTipoUsuario) {
                return res.status(404).json({
                    mensaje: "Falta/n parametro/s obligatorio/s."
                })
            }
            /*
            if(this.buscarPorCorreo(correoElectronico)){
                return res.status(404).json({
                    mensaje: "Ya existe un usuario con esa direccion de correo."
                })
            }
            */
            const contraseniaHash = createHash('sha256').update(contrasenia).digest('hex');
            const usuario = {
                nombre: nombre,
                apellido: apellido,
                correoElectronico: correoElectronico,
                contrasenia: contraseniaHash,
                idTipoUsuario: idTipoUsuario,
                imagen: imagen
            }

            const resultado = await this.usuariosServicios.crear(usuario);

            if (resultado.estado) {
                res.status(201).send({ estado: "OK", data: resultado.data }); //mensaje: "Reclamo creado."
            } else {
                res.status(404).send({ estado: "Falla", mensaje: resultado.mensaje });
            }
            /* 
            if (resultado.affectedRows === 0) {
                return res.status(404).json({
                    mensaje: "No se pudo crear."
                });
            }
                */
            //puedo usar resultado.insertId para ya traerme/verificar/mostrar la entrada creada

            //res.status(200).json(resultado);
        } catch (err) {
            res.status(500).json({
                estado: "Fallo.", mensaje: "Error interno en servidor.", err: err
            });
        };
    }

    //consulta todos
    buscarTodos = async (req, res) => {
        try {
            const resultado = await this.usuariosServicios.buscarTodos();

            if (resultado.length === 0) {
                res.status(500).json({
                    mensaje: "No se encontraron resultados."
                });
            }

            res.status(200).json(resultado);
        } catch (err) {
            res.status(500).json({
                mensaje: "Error"
            });
        }
    }

    /* 
    //consulta todos CON PAGINACION
    buscarTodos = async (req, res) => {
        //Filtros
        //const firstName = req.query.firstName;
        //const lastName = req.query.lastName;
        const nombre = req.query.nombre;
        const apellido = req.query.apellido;

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
            let pOrder = order || "idUsuario"; //¿esto es como esta en la bd, o como se lo renombre con "AS"?
            let pAsc = asc === "false" ? false : true;

            //const data = await this.service.findAll({ firstName, lastName }, pLimit, pOffset, pOrder, pAsc);
            const data = await this.service.findAll({ nombre, apellido}, pLimit, pOffset, pOrder, pAsc);

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
        const id = req.params.idUsuario;

        if (!id) {
            res.status(404).json({ status: "Fallo", data: { error: "El parametro no puede ser vacio." } });
        }

        try {
            const resultado = await this.usuariosServicios.buscarPorId(id);
            /*
            if (resultado.length === 0) {
                res.status(404).json({
                    mensaje: "No se encontro resultado."
                });
            }
            */
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

    actualizar = async (req, res) => {
        const idUsuario = req.params.idUsuario;

        const datos = req.body;

        if (idUsuario === null || idUsuario === undefined) {
            res.status(404).json({ status: "Fallo", data: { error: "El parametro no puede ser vacio." } });
        }
        /*
        if (!this.buscarPorId(idUsuario)) {//mas conveniente llamar en servicios? segun lo hecho por cristian si, asumia que antes era mejor
            res.status(404).json({ status: "Fallo", data: { error: "No existe usuario con el id ingresado." } });
        }
        */

        if (Object.keys(datos).length === 0) {
            return res.status(400).send({
                estado: "Falla",
                mensaje: "No se enviaron datos para pode modificar."
            });
        }

        try {
            const usuarioActualizado = await this.usuariosServicios.actualizar(idUsuario, datos);

            /*
            res.status(204).json({
                usuarioActualizado
            });
            */
            if (usuarioActualizado.estado) {
                res.status(200).send({ estado: "OK", mensaje: usuarioActualizado.mensaje });
            } else {
                res.status(404).send({ estado: "Falla", mensaje: usuarioActualizado.mensaje });
            }
        } catch (error) {
            res.status(500).send({
                estado: "Falla.", mensaje: "Error interno en servidor."
            });
        }
    }

    // método para que un cliente (idTipoUsuario=3) actualice su perfil
    actualizarPerfilCliente = async (req, res) => {
        const idUsuario = req.user.idUsuario;


        if (idUsuario === null || idUsuario === undefined) {
            res.status(404).json({ status: "Fallo", data: { error: "El parametro no puede ser vacio." } });
        }

        //const datosActualizados = req.body;
        const { nombre, apellido, } = req.body;
        const datosActualizados = {
            nombre: nombre,
            apellido: apellido,
            //correoElectronico:correoElectronico
        }

        const imagen = req.file ? req.file.filename : null;
        //datosActualizados.imagen=imagen; //?
        datosActualizados = { ...datosActualizados, imagen };

        // Validar que los datos requeridos estén presentes
        if (Object.keys(datosActualizados).length === 0) {
            return res.status(400).json({ mensaje: "Falta información para actualizar el perfil" });
        }

        try {
            // Llamar al servicio para actualizar
            const resultado = await this.usuariosServicios.actualizarPerfilCliente(idUsuario, datosActualizados);

            if (resultado.estado) {
                res.status(200).json({ mensaje: "Perfil actualizado correctamente" });
            } else {
                res.status(404).json({ mensaje: "No se encontró el usuario" });
            }

        } catch (error) {
            res.status(500).json({ mensaje: "Error interno del servidor" });
        }
    }

    eliminar = async (req, res) => {
        const id = req.params.idUsuario;

        if (!id || !this.buscarPorId(id)) {
            res.status(404).json({
                mensaje: "Id recibido no valido"
            });
        }

        try {
            const resultado = await this.usuariosServicios.eliminar(id);

            //res.status(204).send();
            if (resultado.affectedRows === 0) {
                res.status(404).json({
                    mensaje: "No se pudo dar de baja."
                });
            }

            res.status(204).json({
                mensaje: `Usuario ${id} dado de baja.`
            });

        } catch (error) {
            res.status(500).json({
                mensaje: "Error"
            });
        }
    }

    crearEmpleado = async (req, res) => {
        try {
            const { nombre, apellido, correoElectronico, contrasenia, idTipoUsuario, imagen } = req.body;

            //verifico requeridos

            if (!nombre || !apellido || !correoElectronico || !contrasenia || !idTipoUsuario) {
                return res.status(404).json({
                    mensaje: "Falta/n parametro/s obligatorio/s."
                })
            }

            if (this.usuariosServicios.buscarPorCorreo(correoElectronico)) {
                return res.status(404).json({
                    mensaje: "Ya existe un usuario con esa direccion de correo."
                })
            }

            const contraseniaHash = createHash('sha256').update(contrasenia).digest('hex');
            //console.log(contrasenia+" pasa a ser "+contraseniaHash);
            const usuario = {
                nombre: nombre,
                apellido: apellido,
                correoElectronico: correoElectronico,
                contrasenia: contraseniaHash,
                idTipoUsuario: 2,
                imagen: imagen
            }

            const resultado = await this.usuariosServicios.crear(usuario);

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

    buscarEmpleadosTodos = async (req, res) => {
        //console.log("buscarEmpleadosTodos a usuariosControlador");
        try {
            const resultado = await this.usuariosServicios.buscarEmpleadosTodos();

            if (resultado.length === 0) {
                res.status(500).json({
                    mensaje: "No se encontraron resultados de Empleados."
                });
            }

            //res.status(200).send({estado:"Ok", data:resultado});
            res.status(200).json(resultado);
        } catch (err) {
            res.status(500).json({
                mensaje: "Error interno en el servidor."
            });
        }
    }
    buscarEmpleadosSinOficina = async (req, res) => {
        try {
            const resultado = await this.usuariosServicios.buscarEmpleadosSinOficina();

            if (resultado.length === 0) {
                res.status(500).json({
                    mensaje: "No se encontraron resultados de Empleados sin Oficina."
                });
            }

            res.status(200).json(resultado);
        } catch (err) {
            res.status(500).json({
                mensaje: "Error"
            });
        }
    }
    buscarEmpleadosConOficina = async (req, res) => {
        try {
            const resultado = await this.usuariosServicios.buscarEmpleadosConOficina();

            if (resultado.length === 0) {
                res.status(500).json({
                    mensaje: "No se encontraron resultados de Empleados con Oficina."
                });
            }

            res.status(200).json(resultado);
        } catch (err) {
            res.status(500).json({
                mensaje: "Error"
            });
        }
    }

    actualizarEmpleado = async (req, res) => {
        const id = req.params.idEmpleado;

        const cuerpo = req.body;

        if (id === null || id === undefined) {
            res.status(404).json({ status: "Fallo", data: { error: "El parametro idEmpleado no puede ser vacio." } });
        }
        if (!this.usuariosServicios.esEmpleado(id)) {//seria mas conveniente llamar otra capa?
            res.status(404).json({ status: "Fallo", data: { error: "No existe empleado con el id ingresado." } });
        }

        try {
            const empleadoActualizado = await this.usuariosServicios.actualizar(id, cuerpo);

            res.status(204).json({
                empleadoActualizado
            });
        } catch (error) {
            res.status(500).json({
                mensaje: "Error"
            });
        }
    }

    eliminarEmpleado = async (req, res) => {
        const id = req.params.idUsuario;

        if (!id || !this.buscarPorId(id)) {
            res.status(404).json({
                mensaje: "Id recibido no valido"
            });
        }
        if (!this.usuariosServicios.esEmpleado(id)) {//seria mas conveniente llamar otra capa?
            res.status(404).json({ status: "Fallo", data: { error: "No existe empleado con el id ingresado." } });
        }

        try {
            const resultado = await this.usuariosServicios.eliminar(id);

            //res.status(204).send();
            if (resultado.affectedRows === 0) {
                res.status(404).json({
                    mensaje: "No se pudo dar de baja."
                });
            }

            res.status(204).json({
                mensaje: `Usuario ${id} dado de baja.`
            });

        } catch (error) {
            res.status(500).json({
                mensaje: "Error"
            });
        }
    }


}