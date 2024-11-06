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

        return resultado;
    };


    buscarPorId = async (idOficina) => {
        const consultaSql = "SELECT * FROM oficinas WHERE idOficina=? AND activo=1";
        const [resultado] = await conexion.query(consultaSql, idOficina);

        return resultado;
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

        // agregar un empleado a una oficina
        agregarEmpleado = async (idOficina, idEmpleado) => {
            const consultaSql = "UPDATE empleados SET idOficina=? WHERE idEmpleado=?";
            await conexion.query(consultaSql, [idOficina, idEmpleado]);
            return { mensaje: "Empleado agregado a la oficina correctamente" };
        };
    
        // quitar un empleado de una oficina
        quitarEmpleado = async (idOficina, idEmpleado) => {
            const consultaSql = "UPDATE empleados SET idOficina=NULL WHERE idEmpleado=? AND idOficina=?";
            await conexion.query(consultaSql, [idEmpleado, idOficina]);
            return { mensaje: "El empleado fue quitado de la oficina correctamente" };
        };
      
}
