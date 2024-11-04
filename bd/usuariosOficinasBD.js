import { conexion } from "./conexionBD.js";

export default class UsuariosOficinasBD {

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

        return resultado;
    };

    // Obtener la oficina de un usuario por su ID de usuario
    obtenerOficinaUsuario = async (idUsuario) => {
        const consultaSql = "SELECT idOficina FROM usuarios_oficinas WHERE idUsuario = ? AND activo = 1";
        const [resultado] = await conexion.query(consultaSql, [idUsuario]);

        // Verificar si se encontró una oficina y devolver el resultado
        return resultado.length ? resultado[0].idOficina : null;
    };

    // Buscar un usuario y oficina por ID
    buscarPorId = async (idUsuarioOficina) => {
        const consultaSql = "SELECT * FROM usuarios_oficinas WHERE idUsuarioOficina=? AND activo=1";
        const [resultado] = await conexion.query(consultaSql, [idUsuarioOficina]);

        return resultado;
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
    obtenerReclamosPorOficina = async (idUsuario) => {
        const consultaSql = `
            SELECT r.*
            FROM reclamos r
            JOIN usuarios_oficinas uo ON uo.idOficina = r.idOficina
            WHERE uo.idUsuario = ? AND uo.activo = 1
        `;
        const [reclamos] = await conexion.query(consultaSql, [idUsuario]);

        return reclamos;
    };   

    

}
