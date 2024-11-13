import UsuariosBD from "../bd/usuariosBD.js";

export default class UsuariosServicios {
    constructor() {
        this.usuariosBD = new UsuariosBD();
    }

    crear = async (usuario) => {
        const usuarioCreado = await this.usuariosBD.crear(usuario);
        if (!usuarioCreado) {
            return { estado: false, mensaje: 'Usuario no creado' };
        }
        return { estado: true, mensaje: 'Reclamo creado', data: usuarioCreado };
    };

    buscarTodos = () => {
        return this.usuariosBD.buscarTodos();
    };

    buscarPorId = (idUsuario) => {
        return this.usuariosBD.buscarPorId(idUsuario);
    };

    buscarLogin = (correoElectronico, contrasenia) => {
        return this.usuariosBD.buscarLogin(correoElectronico, contrasenia);
    };

    buscarPorIdValidacion = (idUsuario) => {
        return this.usuariosBD.buscarPorIdValidacion(idUsuario);
    };

    actualizar = async (idUsuario, datos) => {
        //return this.usuariosBD.actualizar(idUsuario, datos);

        const existe = await this.usuariosBD.buscarPorId(idUsuario);
        if (existe === null) {
            return { estado: false, mensaje: "No existe Usuario con ese id." };
        }

        const actualizado = await this.usuariosBD.actualizar(idUsuario, datos);

        if (actualizado) {
            return { estado: true, mensaje: "Usuario modificado." };
        } else {
            return { estado: false, mensaje: "Usuario no modificado." };
        }
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

    buscarPorCorreo = (correoElectronico) => {
        return this.usuariosBD.buscarPorCorreo(correoElectronico);
    };

    // Método específico para actualizar el perfil de un cliente
    actualizarPerfilCliente = async (idUsuario, datos) => {
        /*
        const usuario = await this.buscarPorId(idUsuario);

        // Verifica que el usuario exista y sea del tipo Cliente (idTipoUsuario 3)
        if (!usuario || usuario.idTipoUsuario !== 3) {
            throw new Error("Solo los usuarios tipo Cliente pueden actualizar su perfil.");
        }

        // Llama al método de actualización de datos
        return this.actualizar(idUsuario, datos);
        */

        const existe = await this.usuariosBD.buscarPorId(idUsuario);
        if (existe === null) {//!existe
            return { estado: false, mensaje: "No existe Cliente con ese id." };
        }
        if (existe.idTipoUsuario !== 3) {
            return { estado: false, mensaje: "El usuario no es de tipo Cliente." };
        }

        const actualizado = await this.usuariosBD.actualizar(idUsuario, datos);//o llamar this.actualizar? o usuariosBD.actualizarPerfilCliente

        if (actualizado) {
            return { estado: true, mensaje: "Usuario modificado." };
        } else {
            return { estado: false, mensaje: "Usuario no modificado." };
        }
    };



}