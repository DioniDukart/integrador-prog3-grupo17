import { conexion } from "./conexionBD.js";

export default class UsuariosTiposBD {
    crear = async (usuarioTipoNuevo) => {
        const consultaSql = 'INSERT INTO usuarios_tipo SET ?;';
        const [infoCreacion] = await conexion.query(consultaSql, usuarioTipoNuevo);

        return this.buscarPorId(infoCreacion[0].insertId);
    };

    //usuario= {idUsuarioTipo, descripcion, activo}
    buscarTodos = async () => {
        const consultaSql = "SELECT * FROM usuarios_tipo WHERE activo=1;";
        const [resultado] = await conexion.query(consultaSql);

        //return (resultado.length > 0) ? resultado[0] : null;//me deja solo el primero
        return resultado;
    };

    buscarPorId = async (idUsuarioTipo) => {
        const consultaSql = "SELECT * FROM usuarios_tipo WHERE idUsuarioTipo=? AND activo=1;";
        const [resultado] = await conexion.query(consultaSql, idUsuarioTipo);

        return resultado;
    }

    actualizar = async (idUsuarioTipo, usuarioTipo) => {
        const consultaSql = "UPDATE usuarios_tipo SET ? WHERE idUsuarioTipo=?;";

        await this.conexion.query(consultaSql, [usuarioTipo, idUsuarioTipo]);

        return this.buscarPorId(idUsuarioTipo);
    }

    eliminar = async (idUsuarioTipo) => {
        const consultaSql = "UPDATE usuarios_tipo SET activo=0 WHERE idUsuarioTipo=?;";

        const [resultado] = await this.conexion.query(consultaSql, idUsuarioTipo);

        return resultado;
    }

}