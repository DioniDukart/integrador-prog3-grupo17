import UsuariosTiposServicios from "../servicios/usuariosTiposServicios.js";

export default class UsuariosTiposControlador {
    constructor() {
        this.usuariosTiposServicios = new UsuariosTiposServicios();
    }

    //crea usuario nuevo
    crear = async (req, res) => {
        try {
            const { descripcion } = req.body;

            //verifico requeridos

            if (!descripcion) {
                return res.status(404).json({
                    mensaje: "Falta parametro obligatorio (descripcion)."
                })
            }

            const usuarioTipo = {
                descripcion: descripcion
            }

            const resultado = await this.usuariosTiposServicios.crear(usuarioTipo);

            if (resultado.affectedRows === 0) {
                return res.status(404).json({
                    mensaje: "No se pudo crear."
                });
            }
            //puedo usar resultado.insertId para ya traerme/verificar/mostrar la entrada creada

            //res.status(200).json(resultado);
            res.status(200).json({
                mensaje: "Tipo de Usuario creado." /*post(resultado.insertId) O ,dato:resultado*/
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
            const resultado = await this.usuariosTiposServicios.buscarTodos();

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
    
    //consulta un unico segun su id
    buscarPorId = async (req, res) => {
        const id = req.params.idUsuarioTipo;

        if (!id) {
            res.status(404).json({ status: "Fallo", data: { error: "El parametro no puede ser vacio." } });
        }

        try {
            /*
            const consultaSql = "SELECT * FROM usuarios_tipos WHERE activo=1 AND idUsuarioTipo=?";
            const [resultado] = await conexion.query(consultaSql, [id]);
             */
            const resultado = await this.usuariosTiposServicios.buscarPorId(id);
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
        const id = req.params.idUsuarioTipo;

        const cuerpo = req.body;

        if (id===null || id===undefined) {
            res.status(404).json({ status: "Fallo", data: { error: "El parametro no puede ser vacio." } });
        }
        if (!this.buscarPorId(id)) {//seria mas conveniente llamar otra capa?desconozco
            res.status(404).json({ status: "Fallo", data: { error: "No existe usuario con el id ingresado." } });
        }

        try {
            const usuarioTipoActualizado = await this.usuariosTiposServicios.actualizar(id, cuerpo);

            res.status(204).json({
                usuarioTipoActualizado
            });
        } catch (error) {
            res.status(500).json({
                mensaje: "Error"
            });
        }
    }

    eliminar = async (req, res) => {
        const id = req.params.idUsuarioTipo;

        if (!id || !this.buscarPorId(id)) {
            res.status(404).json({
                mensaje: "Id de Tipo de Usuario recibido no valido"
            });
        }

        try {
            const resultado= await this.usuariosTiposServicios.eliminar(id);
            
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