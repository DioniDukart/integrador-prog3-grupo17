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

        //return (resultado.length > 0) ? resultado[0] : null;//me deja solo el primero
        return resultado;
    }

    buscarPorIdValidacion = async (idUsuario) => {
        const sql = `SELECT CONCAT(u.nombre, ' ', u.apellido) as usuario, u.idTipoUsuario, u.idUsuario FROM usuarios AS u WHERE u.idUsuario = ? AND u.activo = 1;`
        const [resultado] = await conexion.query(sql, [idUsuario]);
        
        //console.log(resultado+"buscarPorIdValidacion-usuariosBD")
        //console.log(resultado[0]+"buscarPorIdValidacion-usuariosBD")
        return resultado[0];
        //return (resultado.length > 0) ? resultado[0] : null;
    }

    buscarLogin = async (correoElectronico, contrasenia) => {
        const consultaSql = `SELECT u.idUsuario, CONCAT(u.nombre, " ", u.apellido) as usuario, u.idTipoUsuario FROM usuarios AS u WHERE u.activo=1 AND u.correoElectronico=? AND u.contrasenia=SHA2(?,256);`;
        const [resultado] = await conexion.query(consultaSql, [correoElectronico, contrasenia]);
        //console.log(resultado);
        //console.log(resultado[0]+" buscarLogin-usuariosBD");
        return resultado[0];
        //return resultado;
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
        const consultaSql = "UPDATE usuarios SET activo=0 WHERE idUsuario=?;";

        const [resultado] = await this.conexion.query(consultaSql, idUsuario);

        return resultado;
    }



    buscarEmpleadosTodos = async () => {
        //console.log("Entra a buscarEmpleadosTodos en usuariosBD");
        const consultaSql = `SELECT u.idUsuario, CONCAT(u.nombre, " ", u.apellido) AS empleado, u.correoElectronico FROM usuarios AS u WHERE u.activo=1 AND u.idTipoUsuario=2;`;
        const [resultado] = await conexion.query(consultaSql);
        
        //console.log(resultado);
        return resultado;
    }

    //SELECT * FROM usuarios WHERE idUsuario NOT IN (SELECT idUsuario FROM usuarios_oficinas) AND idTipoUsuario=2; 
    //SELECT usuarios.* FROM usuarios LEFT JOIN usuarios_oficinas ON usuarios.idUsuario = usuarios_oficinas.idUsuario WHERE usuarios_oficinas.idUsuario IS NULL AND usuarios.activo=1 AND usuarios.idTipoUsuario=2;
    buscarEmpleadosSinOficina = async () => {
        const consultaSql = `SELECT u.idUsuario, CONCAT(u.nombre, " ", u.apellido) AS empleado, u.correoElectronico FROM usuarios AS u 
        LEFT JOIN usuarios_oficinas ON u.idUsuario = usuarios_oficinas.idUsuario 
        WHERE usuarios_oficinas.idUsuario IS NULL AND u.activo=1 AND u.idTipoUsuario=2;`;
        const [resultado] = await conexion.query(consultaSql);

        return resultado;
    }
    //SELECT usuarios.* FROM usuarios INNER JOIN usuarios_oficinas ON usuarios.idUsuario = usuarios_oficinas.idUsuario WHERE usuarios.activo=1 AND  usuarios.idTipoUsuario=2;
    buscarEmpleadosConOficina = async () => {
        const consultaSql = `SELECT u.idUsuario, CONCAT(u.nombre, " ", u.apellido) AS empleado, u.correoElectronico, uo.idOficina FROM usuarios AS u 
        INNER JOIN usuarios_oficinas AS uo ON u.idUsuario = uo.idUsuario 
        WHERE u.activo=1 AND u.idTipoUsuario=2;`;
        const [resultado] = await conexion.query(consultaSql);

        return resultado;
    }

    esEmpleado= async (idEmpleado)=>{//que mas controlar?
        const consultaSql= `SELECT FROM usuarios WHERE idEmpleado=? AND idTipoUsuario=2;`;
        
        const [resultado] = await conexion.query(consultaSql, [idReclamo]);

        //return (resultado.length > 0) ? result[0] : null;
        return resultado;
    }
}