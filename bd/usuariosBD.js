import { conexion } from "./conexionBD.js";

export default class UsuariosBD{
    crear= async (usuarioNuevo)=>{
        const consultaSql = 'INSERT INTO usuarios SET ?';
        const [infoCreacion] = await conexion.query(consultaSql, usuarioNuevo);
        
        return this.buscarPorId(infoCreacion[0].insertId);
    };

    buscarTodos= async ()=>{
        const consultaSql = "SELECT * FROM usuarios WHERE activo=1";
        const [resultado] = await conexion.query(consultaSql);

        return (resultado.length > 0) ? resultado[0] : null;
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

    buscarPorId= async (idUsuario)=>{
        const consultaSql= "SELECT * FROM usuarios WHERE idUsuario=? AND activo=1";
        const [resultado] = await conexion.query(consultaSql, idUsuario);

        return (resultado.length > 0) ? resultado[0] : null;
    }

    actualizar= async (idUsuario, usuario)=>{
        const consultaSql= "UPDATE usuarios SET ? WHERE idUsuario=?";
        
        await this.conexion.query(consultaSql, [usuario, idUsuario]);

        return this.buscarPorId(idUsuario);
    }

    eliminar= async (idUsuario)=>{
        const consultaSql= "UPDATE reclamos SET activo=0 WHERE idUsuario=?";
        
        const [resultado]= await this.conexion.query(consultaSql, idUsuario);

        return resultado;
    }
    
}