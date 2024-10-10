import { conexion } from "./conexionBD.js";

export default class OficinasBD {
    
  
    crear = async (nuevaOficina) => {
        const consultaSql = 'INSERT INTO oficinas SET ?';
        const [infoCreacion] = await conexion.query(consultaSql, nuevaOficina);
        
        return this.buscarPorId(infoCreacion.insertId);
    };

   
    buscarTodas = async () => {
        const consultaSql = "SELECT * FROM oficinas WHERE activo=1";
        const [resultado] = await conexion.query(consultaSql);

        return resultado.length > 0 ? resultado : null;
    };

    
    buscarPorId = async (idOficina) => {
        const consultaSql = "SELECT * FROM oficinas WHERE idOficina=? AND activo=1";
        const [resultado] = await conexion.query(consultaSql, idOficina);

        return resultado.length > 0 ? resultado[0] : null;
    };

    
    actualizar = async (idOficina, oficina) => {
        const consultaSql = "UPDATE oficinas SET ? WHERE idOficina=?";
        
        await conexion.query(consultaSql, [oficina, idOficina]);

        return this.buscarPorId(idOficina);
    };

    
    eliminar = async (idOficina) => {
        const consultaSql = "UPDATE oficinas SET activo=0 WHERE idOficina=?";
        
        const [resultado] = await conexion.query(consultaSql, idOficina);

        return resultado;
    };
}
