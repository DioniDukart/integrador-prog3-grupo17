export default class UsuariosControlador {

    constructor() {
        this.usuariosServicios = new UsuariosServicios();
    }

    //crea usuario nuevo
    crear = async (req, res) => {
        try {
            const { nombre, apellido, correoElectronico, contrasenia, idTipoUsuario, imagen } = req.body;

            //verifico requeridos

            if (!nombre || !apellido || !correoElectronico || !contrasenia || idTipoUsuario) {
                return res.status(404).json({
                    mensaje: "Falta/n parametro/s obligatorio/s."
                })
            }
            /*
            if(this.buscarPorMail(correoElectronico)){
                return res.status(404).json({
                    mensaje: "Ya existe un usuario con esa direccion de correo."
                })
            }
            */
            const usuario = {
                nombre: nombre,
                apellido: apellido,
                correoElectronico: correoElectronico,
                contrasenia: contrasenia,
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

        if (id===null || id===undefined) {
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

    eliminar = async (req, res) => {
        const id = req.params.idUsuario;

        if (!id || !this.buscarPorId(id)) {
            res.status(404).json({
                mensaje: "Id recibido no valido"
            });
        }

        try {
            const resultado= await this.usuariosServicios.eliminar(id);
            
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