import UsuariosBD from "../bd/usuariosBD.js";

export default class UsuariosServicios {
    constructor(){
        this.usuariosBD= new UsuariosBD();
    }

    crear=(usuario)=>{
        return this.usuariosBD.crear(usuario);
    };

    buscarTodos=()=>{
        return this.usuariosBD.buscarTodos();
    };

    buscarPorId=(idUsuario)=>{
        return this.usuariosBD.buscarPorId(idUsuario);
    };

    actualizar=(idUsuario, datos)=>{
        return this.usuariosBD.actualizar(idUsuario, datos);
    };

    eliminar=(idUsuario)=>{
        return this.usuariosBD.eliminar(idUsuario);
    };
}