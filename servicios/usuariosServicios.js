import UsuariosBD from "../bd/usuariosBD.js";

export default class UsuariosServicios {
    constructor() {
        this.usuariosBD = new UsuariosBD();
    }

    crear = (usuario) => {
        return this.usuariosBD.crear(usuario);
    };

    buscarTodos = () => {
        return this.usuariosBD.buscarTodos();
    };

    buscarPorId = (idUsuario) => {
        return this.usuariosBD.buscarPorId(idUsuario);
    };

    actualizar = (idUsuario, datos) => {
        return this.usuariosBD.actualizar(idUsuario, datos);
    };

    eliminar = (idUsuario) => {
        return this.usuariosBD.eliminar(idUsuario);
    };
      // Método específico para actualizar el perfil de un cliente
      actualizarPerfilCliente = async (idUsuario, datos) => {
        const usuario = await this.buscarPorId(idUsuario);

        // Verifica que el usuario exista y sea del tipo Cliente (idTipoUsuario 3)
        if (!usuario || usuario.idTipoUsuario !== 3) {
            throw new Error("Solo los usuarios tipo Cliente pueden actualizar su perfil.");
        }

        // Llama al método de actualización de datos
        return this.actualizar(idUsuario, datos);
    };


}