export default class UsuariosTipoControlador {
    constructor() {
        this.UsuariosTipoServicios = new UsuariosTipoServicios();
    }

    // Crear un nuevo tipo de usuario

    crear = async (req, res) => {
        try {
            const { nombreUsuarioTipo } = req.body;
            if (!nombreUsuarioTipo) {
                return res.status(404).json({
                    mensaje: "Falta/n parametro/s obligatorio/s."
                })
            }
    

            const nuevoUsuarioTipo = { nombreUsuarioTipo };

            const resultado = await this.UsuariosTipoServicios.crear(nuevoUsuarioTipo);

            if (resultado.affectedRows === 0) {
                return res.status(404).json({
                    mensaje: "No se pudo crear."
                });
            }
            

            res.status(200).json({ mensaje: "Tipo de usuario creado correctamente." });
        } catch (error) {
            res.status(500).json({ mensaje: "Error al crear el tipo de usuario." });
        }
    }

    // Obtener todos los tipos de usuario

    buscarTodos = async (req, res) => {
        try {
            const resultado = await this.UsuariosTipoServicios.buscarTodos();

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
    

    // Obtener un tipo de usuario por ID
    buscarPorId = async (req, res) => {
        const idTipoUsuario = req.params.idUsuarioTipo;

        if (!idUsuarioTipo) {
            return res.status(404).json({ mensaje: "id de tipo de usurio" });
        }

        try {
            const resultado = await this.UsuariosTipoServicios.buscarPorId(idUsuarioTipo);

            if (!resultado) {
                res.status(404).json({ mensaje: "No se encontró el tipo de usuario." });
            }

            res.status(200).json(resultado);
        } catch (error) {
            res.status(500).json({ mensaje: "Error" });
        }
    }
    
    // Actualizar un tipo de usuario
    actualizar = async (req, res) => {
        const idUsuarioTipo = req.params.idUsuarioTipo;
        const { nombreUsuarioTipo } = req.body;

        if (!idUsuarioTipo || !nombreUsuarioTipo) {
            return res.status(404).json({ mensaje: "id tipo de usuario" });
        }

        try {
            const resultado = await this.UsuariosTipoServicios.actualizar(idUsuarioTipo, { nombreUsuarioTipo });

            if (resultado.affectedRows === 0) {
                 res.status(404).json({ mensaje: "No se pudo actualizar el tipo de usuario." });
            }

            res.status(200).json({ mensaje: "Tipo de usuario actualizado." });
        } catch (error) {
            res.status(500).json({ mensaje: "Error." });
        }
    }

    // Eliminar un tipo de usuario
    
    eliminar = async (req, res) => {
        const idUsuarioTipo = req.params.idUsuarioTipo;

        if (!idUsuarioTipo) {
            return res.status(404).json({ mensaje: "id tipo de usuario." });
        }

        try {
            const resultado = await this.UsuariosTipoServicios.eliminar(idUsuarioTipo);

            if (resultado.affectedRows === 0) {
                return res.status(404).json({ mensaje: "No se pudo eliminar el tipo de usuario." });
            }

            res.status(200).json({ mensaje: "Tipo de usuario eliminado correctamente." });
        } catch (error) {
            res.status(500).json({ mensaje: "Error al eliminar el tipo de usuario." });
        }
    }
}




