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

    buscarLogin = async (correoElectronico, contrasenia) => {
        return await this.usuariosBD.buscarLogin(correoElectronico, contrasenia);
    };

    buscarPorIdValidacion = async (idUsuario) => {
        return await this.usuariosBD.buscarPorIdValidacion(idUsuario);
    };

    actualizar = (idUsuario, datos) => {
        return this.usuariosBD.actualizar(idUsuario, datos);
    };

    eliminar = (idUsuario) => {
        return this.usuariosBD.eliminar(idUsuario);
    };



    buscarEmpleadosTodos = () => {
        //console.log("llega a servicios");
        return this.usuariosBD.buscarEmpleadosTodos();
    };
    buscarEmpleadosSinOficina = () => {
        return this.usuariosBD.buscarEmpleadosSinOficina();
    };
    buscarEmpleadosConOficina = () => {
        return this.usuariosBD.buscarEmpleadosConOficina();
    };

    esEmpleado = (idEmpleado) => {
        return this.usuariosBD.esEmpleado(idEmpleado);
    };

    buscarPorCorreo= (correoElectronico)=>{
        return this.usuariosBD.buscarPorCorreo(correoElectronico);
    }
}