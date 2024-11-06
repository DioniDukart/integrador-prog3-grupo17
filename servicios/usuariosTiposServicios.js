import UsuariosTiposBD from "../bd/usuariosTiposBD.js";

export default class UsuariosServicios {
    constructor() {
        this.usuariosTiposBD = new UsuariosTiposBD();
    }

    crear = (usuario) => {
        return this.usuariosTiposBD.crear(usuarioTipo);
    };

    buscarTodos = () => {
        return this.usuariosTiposBD.buscarTodos();
    };

    buscarPorId = (idUsuarioTipo) => {
        return this.usuariosTiposBD.buscarPorId(idUsuarioTipo);
    };

    actualizar = (idUsuarioTipo, datos) => {
        return this.usuariosTiposBD.actualizar(idUsuarioTipo, datos);
    };

    eliminar = (idUsuarioTipo) => {
        return this.usuariosTiposBD.eliminar(idUsuarioTipo);
    };
}