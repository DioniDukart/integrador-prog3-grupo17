import UsuariosServicios from "../servicios/usuariosServicios.js";
import {createHash} from "crypto";

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
            const contraseniaHash= createHash('sha256').update(contrasenia).digest('hex');
            //console.log(contrasenia+" pasa a ser "+contraseniaHash);
            const usuario = {
                nombre: nombre,
                apellido: apellido,
                correoElectronico: correoElectronico,
                contrasenia: contraseniaHash,
                idTipoUsuario: idTipoUsuario,
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
            /*
            const consultaSql = "SELECT * FROM usuarios WHERE activo=1 AND idUsuario=?";
            const [resultado] = await conexion.query(consultaSql, [id]);
             */
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
        const id = req.params.idUsuario;

        const cuerpo = req.body;

        if (id === null || id === undefined) {
            res.status(404).json({ status: "Fallo", data: { error: "El parametro no puede ser vacio." } });
        }
        if (!this.buscarPorId(id)) {//seria mas conveniente llamar otra capa?desconozco
            res.status(404).json({ status: "Fallo", data: { error: "No existe usuario con el id ingresado." } });
        }
        /*
        //si idUsuarioTipo tiene un valor valido, verifico que sea un numero y que no este fuera del rango de valores valido
        if(cuerpo.idUsuarioTipo){
            let num= Number(cuerpo.idUsuarioTipo);
            if (num<3 ||num>1){//podria verificar que tambien sea menor a algo?
                res.status(404).json({ status: "Fallo", data: { error: "El valor para el campo estado de reclamo no es valido." } });
            }
        }
        */

        try {
            const usuarioActualizado = await this.usuariosServicios.actualizar(id, cuerpo);

            res.status(204).json({
                usuarioActualizado
            });
        } catch (error) {
            res.status(500).json({
                mensaje: "Error"
            });
        }
    }
    // método para actualizar el perfil de un cliente
    actualizarPerfilCliente = async (req, res) => {
        try {
            const idUsuario = req.params.idUsuario;
            const datosActualizados = req.body;

            // Validar que los datos requeridos estén presentes
            if (!idUsuario || !datosActualizados) {
                return res.status(400).json({ mensaje: "Falta información para actualizar el perfil" });
            }

            // Llamar al servicio para actualizar
            const resultado = await this.usuariosServicios.actualizarPerfilCliente(idUsuario, datosActualizados);

            if (resultado) {
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
            
            if(this.usuariosServicios.buscarPorCorreo(correoElectronico)){
                return res.status(404).json({
                    mensaje: "Ya existe un usuario con esa direccion de correo."
                })
            }
            
            const contraseniaHash= createHash('sha256').update(contrasenia).digest('hex');
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
/*
     // Actualiza perfil de cliente si el idTipoUsuario es 3
     actualizarPerfilCliente = async (req, res) => {
        const id = req.params.idUsuario;
        const cuerpo = req.body;

        if (!id) {
            return res.status(404).json({ mensaje: "El parametro idUsuario no puede ser vacío." });
        }

        try {
            const usuario = await this.usuariosServicios.buscarPorId(id);

            if (!usuario) {
                return res.status(404).json({ mensaje: "No existe usuario con el id ingresado." });
            }

            // Verificar que el idTipoUsuario del usuario sea 3 (Cliente)
            if (usuario.idTipoUsuario !== 3) {
                return res.status(403).json({ mensaje: "Solo los usuarios tipo Cliente pueden actualizar su perfil." });
            }

            const usuarioActualizado = await this.usuariosServicios.actualizar(id, cuerpo);
            res.status(200).json({ mensaje: "Perfil de cliente actualizado exitosamente.", usuarioActualizado });
        } catch (error) {
            res.status(500).json({ mensaje: "Error al actualizar el perfil de cliente." });
        }
    }


*/






}