import { conexion } from "./conexionBD.js";

export default class UsuariosOficinaBD {

    // Crear un nuevo usuario y asociarlo a una oficina
    crear = async (usuarioNuevo) => {
        const consultaSql = 'INSERT INTO usuarios_oficinas SET ?';
        const [infoCreacion] = await conexion.query(consultaSql, usuarioNuevo);
        
        return this.buscarPorId(infoCreacion.insertId);
    };

    // Buscar todos los usuarios y oficinas activas
    buscarTodos = async () => {
        const consultaSql = "SELECT * FROM usuarios_oficinas WHERE activo=1";
        const [resultado] = await conexion.query(consultaSql);

        return (resultado.length > 0) ? resultado : null;
    };

    // Buscar un usuario y oficina por ID
    buscarPorId = async (idUsuarioOficina) => {
        const consultaSql = "SELECT * FROM usuarios_oficinas WHERE idUsuarioOficina=? AND activo=1";
        const [resultado] = await conexion.query(consultaSql, [idUsuarioOficina]);

        return (resultado.length > 0) ? resultado[0] : null;
    };

    // Actualizar un usuario y oficina
    actualizar = async (idUsuarioOficina, usuarioOficinaActualizado) => {
        const consultaSql = "UPDATE usuarios_oficinas SET ? WHERE idUsuarioOficina=?";
        
        await conexion.query(consultaSql, [usuarioOficinaActualizado, idUsuarioOficina]);

        return this.buscarPorId(idUsuarioOficina);
    };

    // Eliminar (desactivar) un usuario y oficina
    eliminar = async (idUsuarioOficina) => {
        const consultaSql = "UPDATE usuarios_oficinas SET activo=0 WHERE idUsuarioOficina=?";
        
        const [resultado] = await conexion.query(consultaSql, [idUsuarioOficina]);

        return resultado;
    };

}
