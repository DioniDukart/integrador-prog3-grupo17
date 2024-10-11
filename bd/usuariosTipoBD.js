import { conexion } from "./conexionBD.js";



export default class UsuariosTipoBD{
    crear= async (usuarioTipoNuevo)=>{
        const consultaSql = 'INSERT INTO usuarios SET ?';
        const [infoCreacion] = await conexion.query(consultaSql, usuarioTipoNuevo);
        
        return this.buscarPorId(infoCreacion[0].insertId);
    }};

    buscarTodos= async ()=>{
        const consultaSql = "SELECT * FROM usuarios WHERE activo=1";
        const [resultado] = await conexion.query(consultaSql);

        return (resultado.length > 0) ? resultado[0] : null;
    };