import { conexion } from "./conexionBD.js";

export default class ReclamosBD {
    crear = async (reclamoNuevo) => {
        const consultaSql = 'INSERT INTO reclamos SET ?';
        const [infoCreacion] = await conexion.query(consultaSql, reclamoNuevo);

        //return this.buscarPorId(infoCreacion[0].insertId);//este no puede ir pq controlo con affectedRows en el controller
        return infoCreacion;
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
        const consultaSql = `SELECT * FROM reclamos WHERE idReclamo = ?`;
        const [result] = await conexion.query(consultaSql, [idReclamo]);
        return (result.length > 0) ? result[0] : null;

        /* //console.log("Llega a BuscarPorId de reclamosBD");

        //const consultaSql= "SELECT * FROM reclamos WHERE idReclamo=?";
        //const consultaSql= "SELECT r.idReclamo, r.asunto, r.descripcion, r.fechaCreado, r.fechaFinalizado, r.fechaCancelado, rE.descripcion FROM reclamos AS r INNER JOIN reclamos_estado AS rE ON rE.idReclamoEstado=r.idReclamoEstado WHERE r.idReclamo=? AND rE.activo=1";
        const consultaSql = "SELECT r.idReclamo, r.asunto, r.descripcion, r.fechaCreado, r.fechaFinalizado, r.fechaCancelado, rE.descripcion AS estado, rT.descripcion AS tipo FROM reclamos AS r INNER JOIN reclamos_estado AS rE ON rE.idReclamoEstado=r.idReclamoEstado INNER JOIN reclamos_tipo AS rT ON rT.idReclamoTipo=r.idReclamoTipo WHERE r.idReclamo=? AND rE.activo=1 AND rT.activo=1";

        const [resultado] = await conexion.query(consultaSql, idReclamo);

        //return (resultado.length > 0) ? resultado[0] : null;
        return resultado;
        */
    }

    actualizar = async (idReclamo, datos) => {
        const consultaSql = 'UPDATE reclamos SET ? WHERE idReclamo = ?';
        const [resultado] = await conexion.query(consultaSql, [datos, idReclamo]);

        if (resultado.affectedRows === 0) {
            return false;
        }

        return true;
    }

    buscarReclamosUsuario = async (idUsuario) => {
        const consultaSql = `SELECT r.idReclamo, r.asunto, r.descripcion, r.fechaCreado, r.fechaFinalizado, r.fechaCancelado, re.descripcion, rt.descripcion FROM reclamos r 
        INNER JOIN reclamos_estado AS re ON re.idReclamoEstado=r.idReclamoEstado 
        INNER JOIN reclamos_tipo AS rt ON rt.idReclamoTipo=r.idReclamoTipo 
        WHERE r.idUsuarioCreador = ?`;
        const [resultado] = await conexion.query(consultaSql, [idUsuario]);

        return resultado;
    }

    buscarReclamosOficina = async (id) => {
        const consultaSql = `SELECT * FROM reclamos WHERE idReclamoTipo = ?`;
        const [resultado] = await conexion.query(consultaSql, [id]);

        return resultado;
    }


    /*
        actualizar = async (idReclamo, reclamo) => {
            const consultaSql = "UPDATE reclamos SET ? WHERE idReclamo=?";
    
            await this.conexion.query(consultaSql, [reclamo, idReclamo]);
            console.log("estamos en actualizar");
            console.log(idReclamo, reclamo);
            return this.buscarPorId(idReclamo);
        }
    */

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
        const [resultado] = await conexion.query(consultaSql, [idReclamo]);
        return resultado;
    }

    esCancelable = async (idReclamo) => {//que mas controlar? OJO CON =null, probar y si no anda es IS NULL
        // TAREA
        // que otro dato podría consultar además del estado? 
        //que no este ya cancelado (tener fechaCancelado?-estado cancelado?), que no este finalizado, la pertenencia del usuario a la oficina?
        const consultaSql = `SELECT * FROM reclamos WHERE idReclamo=? AND idReclamoEstado=1 AND fechaFinalizado IS NULL AND fechaCancelado IS NULL AND idUsuarioFinalizador IS NULL;`;//AND fechaFinalizado=null AND fechaCancelado=null ??? idUsuarioFinalizador=null
        const [resultado] = await conexion.query(consultaSql, [idReclamo]);

        //return (resultado.length > 0) ? result[0] : null;
        //console.log(resultado);
        return resultado;
    }

    coincidenciaReclamoOficina = async (idUsuario, idReclamo) => {
        const consultaSql = `SELECT r.idReclamo, r.idReclamoTipo AS reclamo_tipo, o.idReclamoTipo AS oficina_tipo
        FROM reclamos r
        JOIN usuarios_oficinas uo ON uo.idUsuario = ?
        JOIN oficinas o ON uo.idOficina = o.idOficina
        WHERE r.idReclamo = ? AND r.idReclamoTipo = o.idReclamoTipo;`

        //const [rows]
        const [resultado] = await conexion.query(consultaSql, [idUsuario, idReclamo]);
        //return (resultado.length > 0) ? resultado[0] : null;
        //return resultado;

        //return rows.length > 0;
        return resultado.length > 0;
    }


    //a partir de mi id, buscar la oficina a la que pertenezco, y le quito su idReclamoTipo
    obtenerReclamoPorId = async (idUsuario) => {
        const consultaSql = "SELECT  FROM reclamos WHERE idReclamo = ?";
        const [reclamo] = await conexion.query(consultaSql, [idReclamo]);
        return reclamo.length > 0 ? reclamo[0] : null;
    };

    obtenerTipoReclamoPorUsuario = async (idUsuario) => {
        const consultaSql = `SELECT o.idReclamoTipo FROM oficinas o JOIN usuarios_oficinas uo ON o.idOficina = uo.idOficina WHERE uo.idUsuario = ?;`

        const [tipoReclamo] = await conexion.query(consultaSql, [idUsuario]);

        //return tipoReclamo;
        return (tipoReclamo.length > 0) ? tipoReclamo[0] : null;
    };

    actualizarEstadoReclamo = async (idReclamo, idReclamoEstado) => {
        const consultaSql = "UPDATE reclamos SET idReclamoEstado = ? WHERE idReclamo = ?";
        const [resultado] = await conexion.query(consultaSql, [idReclamoEstado, idReclamo]);
        return resultado.affectedRows > 0;
    };

    buscarDatosReportePdf = async () => {
        const consultaSql = 'CALL `datosPDF`()'; //llamado al procedmiento almacenado
        const [result] = await conexion.query(consultaSql);

        const datosReporte = {
            reclamosTotales: result[0][0].reclamosTotales,
            reclamosNoFinalizados: result[0][0].reclamosNoFinalizados,
            reclamosFinalizados: result[0][0].reclamosFinalizados,
            descripcionTipoRreclamoFrecuente: result[0][0].descripcionTipoRreclamoFrecuente,
            cantidadTipoRreclamoFrecuente: result[0][0].cantidadTipoRreclamoFrecuente
        }

        return datosReporte;
    }

    buscarDatosReporteCsv = async () => {
        const consultaSql = `SELECT r.idReclamo as 'reclamo', rt.descripcion as 'tipo', re.descripcion AS 'estado', 
        DATE_FORMAT(r.fechaCreado, '%Y-%m-%d %H:%i:%s') AS 'fechaCreado', CONCAT(u.nombre, ' ', u.apellido) AS 'cliente' 
        FROM reclamos AS r 
        INNER JOIN reclamos_tipo AS rt ON rt.idReclamoTipo = r.idReclamoTipo 
        INNER JOIN reclamos_estado AS re ON re.idReclamoEstado = r.idReclamoEstado 
        INNER JOIN usuarios AS u ON u.idUsuario = r.idUsuarioCreador 
        WHERE r.idReclamoEstado <> 4;`;

        const [result] = await conexion.query(consultaSql);
        return result;
    }

}
