import { conexion } from "./conexionBD.js";

export default class ReclamosBD{
    crear= async (reclamoNuevo)=>{
        const consultaSql = 'INSERT INTO reclamos SET ?';
        const [infoCreacion] = await conexion.query(consultaSql, reclamoNuevo);
        
        return this.buscarPorId(infoCreacion[0].insertId);
    };

    buscarTodos= async ()=>{
        const consultaSql = "SELECT * FROM reclamos";
        const [resultado] = await conexion.query(consultaSql);

        return (resultado.length > 0) ? resultado[0] : null;
    };

    /*
    //Consulta todos CON PAGINACION
    buscarTodos= async (filter = null, limit = 0, offset = 0, order = "idReclamo", asc = "ASC") => {

        // Defino el string de consulta
        let strSql= "SELECT * FROM reclamos WHERE activo=1";
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

    buscarPorId= async (idReclamo)=>{
        const consultaSql= "SELECT * FROM reclamos WHERE idReclamo=?";
        const [resultado] = await conexion.query(consultaSql, idReclamo);

        return (resultado.length > 0) ? resultado[0] : null;
    }

    actualizar= async (idReclamo, reclamo)=>{
        const consultaSql= "UPDATE reclamos SET ? WHERE idReclamo=?";
        
        await this.conexion.query(consultaSql, [reclamo, idReclamo]);

        return this.buscarPorId(idReclamo);
    }

    eliminar= async (idReclamo)=>{
        //const consultaSql= "UPDATE reclamos SET activo=0 WHERE idReclamo=?";//deberia cambiar el activo de reclamo_
        const consultaSql= "DELETE FROM reclamos WHERE idReclamo=?";
        
        const [resultado]= await this.conexion.query(consultaSql, idReclamo);

        return resultado;
    }
}