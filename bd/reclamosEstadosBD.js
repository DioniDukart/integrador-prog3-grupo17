import dotenv from "dotenv";
dotenv.config();

//Uso mysql2/promise para conectarme a MySQL usando promises
import mysql from "mysql2/promise";

export default class ReclamosEstadosBD{
    constructor(){
        this.initConnection();
    }

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

        return (resultado.length > 0) ? resultado[0] : null;
    };

    actualizar= async (idReclamoEstado, datos)=>{
        const consultaSql= "UPDATE reclamos_estado SET ? WHERE idReclamo=?";
        await this.conexion.query(consultaSql, [datos, idReclamoEstado]);

        return this.buscarPorId(idReclamoEstado);
    };

    eliminar= async (idReclamo)=>{
        const consultaSql= "UPDATE reclamos SET activo=0 WHERE idReclamo=?";
        
        const [resultado]= await this.conexion.query(consultaSql, idReclamo);

        return resultado;
    };
}