import { conexion } from "./conexionBD.js";

export default class ReclamosEstadosBD{
    crear= async (reclamoEstadoNuevo)=>{
    //crear= async (descripcion, activo)=>{  
        //const consultaSql = 'INSERT INTO reclamos_estado (descripcion, activo) VALUES (?,?)';
        const consultaSql = 'INSERT INTO reclamos_estado SET ?';
        //const [infoCreacion] = await conexion.query(consultaSql, [descripcion, activo]);            
        const [infoCreacion] = await conexion.query(consultaSql, reclamoEstadoNuevo);
        
        return this.buscarPorId(infoCreacion[0].insertId);
    };

    buscarTodos= async ()=>{
        const consultaSql = "SELECT * FROM reclamos_estado WHERE activo=1;";
        //con los corchetes "desestructuro" la informacion, quedandome asi los datos sin la metadata de la consulta hecha
        const [resultado] = await conexion.query(consultaSql);

        return resultado;
    };
    
    buscarPorId= async (idReclamoEstado)=>{
        //const consultaSql = `SELECT * FROM reclamos_estado WHERE activo=1 AND idReclamosEstado=${id}`; //EVITAR " $() ", vulnerable a injectsql
        const consultaSql= "SELECT * FROM reclamos_estado WHERE idReclamoEstado=? AND activo=1;";
        const [resultado] = await conexion.query(consultaSql, idReclamoEstado);

        return resultado;
    };

    actualizar= async (idReclamoEstado, datos)=>{
        const consultaSql= "UPDATE reclamos_estado SET ? WHERE idReclamoEstado=?";
        await this.conexion.query(consultaSql, [datos, idReclamoEstado]);

        return this.buscarPorId(idReclamoEstado);
    };

    eliminar= async (idReclamoEstado)=>{
        const consultaSql= "UPDATE reclamos_estado SET activo=0 WHERE idReclamoEstado=?";
        
        const [resultado]= await this.conexion.query(consultaSql, idReclamoEstado);

        return resultado;
    };
}