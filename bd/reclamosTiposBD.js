import { conexion } from "./conexionBD.js";

export default class ReclamosTiposBD {
    // Crear un nuevo reclamo tipo
    crear = async (reclamoTipoNuevo) => {
        const consultaSql = 'INSERT INTO reclamos_tipo SET ?';
        const [infoCreacion] = await conexion.query(consultaSql, reclamoTipoNuevo);

        return this.buscarPorId(infoCreacion.insertId);
    };

    // Buscar todos los tipos de reclamos activos
    buscarTodos = async () => {
        const consultaSql = "SELECT * FROM reclamos_tipo WHERE activo=1";
        const [resultado] = await conexion.query(consultaSql);

        return resultado;
    };

    // Buscar un tipo de reclamo por ID
    buscarPorId = async (idReclamoTipo) => {
        const consultaSql = "SELECT * FROM reclamos_tipo WHERE idReclamoTipo=? AND activo=1";
        const [resultado] = await conexion.query(consultaSql, [idReclamoTipo]);

        return resultado;
    };

    // Actualizar un tipo de reclamo
    // Solo cambiar la {descripcion?}
    actualizar = async (idReclamoTipo, reclamoTipoActualizado) => {
        const consultaSql = "UPDATE reclamos_tipo SET ? WHERE idReclamoTipo=?";

        //await conexion.query(consultaSql, [reclamoTipoActualizado, idReclamoTipo]);
        const [resultado]= await conexion.query(consultaSql, [reclamoTipoActualizado, idReclamoTipo]);

        //return this.buscarPorId(idReclamoTipo);
        
        if (resultado.affectedRows === 0) {
            return false;
        }
        return true;
        
    };

    // Desactivar un tipo de reclamo
    desactivar = async (idReclamoTipo) => {
        const consultaSql = "UPDATE reclamos_tipo SET activo=0 WHERE idReclamoTipo=?";

        const [resultado] = await conexion.query(consultaSql, [idReclamoTipo]);

        return resultado;
    };
    
    eliminar = async (idReclamoTipo) => {
        const consultaSql = "DELETE FROM reclamos_tipo WHERE idReclamoTipo=?";

        const [resultado] = await conexion.query(consultaSql, [idReclamoTipo]);

        return resultado;
    };
}


//Falta testear