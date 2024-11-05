import { conexion } from "./conexionBD.js";

export default class UsuariosBD {
    crear = async (usuarioNuevo) => {
        const consultaSql = 'INSERT INTO usuarios SET ?;';
        const [infoCreacion] = await conexion.query(consultaSql, usuarioNuevo);

        return this.buscarPorId(infoCreacion[0].insertId);
    };

    //usuario= {idUsuario, nombre, apellido, correoElectronico, contrasenia, idTipoUsuario, imagen, activo}
    buscarTodos = async () => {
        const consultaSql = "SELECT * FROM usuarios WHERE activo=1;";
        const [resultado] = await conexion.query(consultaSql);

        //return (resultado.length > 0) ? resultado[0] : null;//me deja solo el primero
        return resultado;
    };

    /*
    //Consulta todos CON PAGINACION
    buscarTodos= async (filter = null, limit = 0, offset = 0, order = "idReclamo", asc = "ASC") => {

        // Defino el string de consulta
        let strSql= "SELECT usuarioId, nombre, apellido FROM usuarios WHERE activo=1";
        //let strSql = `SELECT actor_id AS actorId, first_name AS firstName, last_name AS lastName, last_update AS lastUpdate FROM actor `

        const filterValuesArray = [];

        if (filter && Object.keys(filter).length > 0) {
            strSql += "WHERE ";
            for (const clave in filter) {
                strSql += `${clave} = ? AND `;

                filterValuesArray.push(filter[clave]);
            }

            strSql = strSql.substring(0, strSql.length - 4);
        }

        strSql += ` ORDER BY ${order} ${asc}`;

        if (limit) {
            strSql += 'LIMIT ? OFFSET ? ';
        }

        // Ejecuto la consulta
        const [rows] = await this.conexion.query(strSql, [...filterValuesArray, limit, offset]);
        return rows;

    }
    */
    //SELECT CONCAT(u.nombre, " ", u.apellido) AS usuario, u.correoElectronico, INNER JOIN usuarios_tipo ON 
    //AS FROM usuarios WHERE idUsuario=? AND activo=1;
    buscarPorId = async (idUsuario) => {
        const consultaSql = "SELECT * FROM usuarios WHERE idUsuario=? AND activo=1;";
        const [resultado] = await conexion.query(consultaSql, idUsuario);

        return resultado;
    }

    buscarLogin = async (idUsuario, contrasenia) => {
        const consultaSql = `SELECT u.idUsuario, CONCAT(u.nombre, " ", u.apellido) as usuario, u.idUsuarioTipo FROM usuarios AS u WHERE u.activo=1 AND u.idUsuario=? AND u.contrasenia=SHA(?,256);`;
        const [resultado] = await conexion.query(consultaSql, [idUsuario, contrasenia]);

        return resultado;
    }

    buscarPorCorreo = async (correo) => {
        const consultaSql = "SELECT * FROM usuarios WHERE correoElectronico=? AND activo=1;";
        const [resultado] = await conexion.query(consultaSql, correo);

        return resultado;
    }

    actualizar = async (idUsuario, usuario) => {
        const consultaSql = "UPDATE usuarios SET ? WHERE idUsuario=?;";

        await this.conexion.query(consultaSql, [usuario, idUsuario]);

        return this.buscarPorId(idUsuario);
    }

    eliminar = async (idUsuario) => {
        const consultaSql = "UPDATE reclamos SET activo=0 WHERE idUsuario=?;";

        const [resultado] = await this.conexion.query(consultaSql, idUsuario);

        return resultado;
    }
    // Método para actualizar solo el perfil de un usuario de tipo Cliente
    actualizarPerfilCliente = async (idUsuario, datos) => {
        // Primero, obtenemos el usuario por su ID
        const usuario = await this.buscarPorId(idUsuario);

        // Verificamos que el usuario exista y sea del tipo Cliente (idTipoUsuario 3)
        if (!usuario || usuario.idTipoUsuario !== 3) {
            throw new Error("Solo los usuarios tipo Cliente pueden actualizar su perfil.");
        }

        // Si cumple con la validación, procedemos con la actualización
        const consultaSql = "UPDATE usuarios SET ? WHERE idUsuario=?;";
        await conexion.query(consultaSql, [datos, idUsuario]);

        return this.buscarPorId(idUsuario);
    };



}