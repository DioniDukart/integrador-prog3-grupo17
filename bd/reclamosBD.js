import { conexion } from "./conexionBD.js";

export default class ReclamosBD {
    crear = async (reclamoNuevo) => {
        const consultaSql = 'INSERT INTO reclamos SET ?';
        const [infoCreacion] = await conexion.query(consultaSql, reclamoNuevo);

        return this.buscarPorId(infoCreacion[0].insertId);
    };

    buscarTodos = async () => {
        //console.log("Entra en buscarTodos de reclamosBD");
        const consultaSql = "SELECT * FROM reclamos";
        const [resultado] = await conexion.query(consultaSql);

        //return (resultado.length > 0) ? resultado[0] : null;//me deja solo el primero
        return resultado;
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

    buscarPorId = async (idReclamo) => {
        //console.log("Llega a BuscarPorId de reclamosBD");

        //const consultaSql= "SELECT * FROM reclamos WHERE idReclamo=?";
        //const consultaSql= "SELECT r.idReclamo, r.asunto, r.descripcion, r.fechaCreado, r.fechaFinalizado, r.fechaCancelado, rE.descripcion FROM reclamos AS r INNER JOIN reclamos_estado AS rE ON rE.idReclamoEstado=r.idReclamoEstado WHERE r.idReclamo=? AND rE.activo=1";
        const consultaSql = "SELECT r.idReclamo, r.asunto, r.descripcion, r.fechaCreado, r.fechaFinalizado, r.fechaCancelado, rE.descripcion AS estado, rT.descripcion AS tipo FROM reclamos AS r INNER JOIN reclamos_estado AS rE ON rE.idReclamoEstado=r.idReclamoEstado INNER JOIN reclamos_tipo AS rT ON rT.idReclamoTipo=r.idReclamoTipo WHERE r.idReclamo=? AND rE.activo=1 AND rT.activo=1";

        const [resultado] = await conexion.query(consultaSql, idReclamo);
        
        //return (resultado.length > 0) ? resultado[0] : null;
        return resultado;
    }

    sePuedeCancelar = async (idReclamo) => {
        // TAREA
        // que otro dato podría consultar además del estado? 
        //que no este ya cancelado (tener fechaCancelado?-estado cancelado?), que no este finalizado, la pertenencia del usuario a la oficina?
        const sql = `SELECT * FROM reclamos WHERE idReclamo = ? AND idReclamoEstado = 1`;
        const [result] = await conexion.query(sql, [idReclamo]);
        return (result.length > 0) ? result[0] : null;
    }

    actualizar = async (idReclamo, reclamo) => {
        const consultaSql = "UPDATE reclamos SET ? WHERE idReclamo=?";

        await this.conexion.query(consultaSql, [reclamo, idReclamo]);

        return this.buscarPorId(idReclamo);
    }

    eliminar = async (idReclamo) => {
        //const consultaSql= "UPDATE reclamos SET activo=0 WHERE idReclamo=?";//reclamo no tiene campo "activo"
        const consultaSql = "DELETE FROM reclamos WHERE idReclamo=?";

        const [resultado] = await this.conexion.query(consultaSql, idReclamo);

        return resultado;
    }

    buscarClientePorReclamo = async (idReclamo) => {
        const consultaSql = `SELECT CONCAT(u.nombre, ' ' , u.apellido) AS nombre, u.correoElectronico, re.descripcion AS estado FROM reclamos AS r
         INNER JOIN usuarios AS u ON u.idUsuario= r.idUsuarioCreador 
         INNER JOIN reclamos_estado AS re ON re.idReclamoEstado=r.idReclamoEstado 
         WHERE r.idReclamo=?;`;
        const [resultado] = await conexion.query(sql, [idReclamo]);
        return resultado;
    }

    esCancelable= async (idReclamo)=>{
        const consultaSql= `SELECT FROM reclamos WHERE idReclamo=? AND idReclamoEstado=1;`;//AND fechaFinalizado=null AND fechaCancelado=null ??? idUsuarioFinalizador=null
        const [resultado] = await conexion.query(consultaSql, [idReclamo]);
        return resultado;
    }
    obtenerReclamoPorId = async (idReclamo) => {
        const consultaSql = "SELECT * FROM reclamos WHERE idReclamo = ?";
        const [reclamo] = await conexion.query(consultaSql, [idReclamo]);
        return reclamo.length > 0 ? reclamo[0] : null;
    };

    actualizarEstadoReclamo = async (idReclamo, idReclamoEstado) => {
        const consultaSql = "UPDATE reclamos SET idReclamoEstado = ? WHERE idReclamo = ?";
        const [resultado] = await conexion.query(consultaSql, [idReclamoEstado, idReclamo]);
        return resultado.affectedRows > 0;
    };
}

