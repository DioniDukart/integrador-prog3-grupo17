import ReclamosBD from "../bd/reclamosBD.js";
import NotificacionesServicios from "./notificacionesServicios.js";
import UsuariosOficinasBD from "../bd/usuariosOficinasBD.js";

export default class ReclamosServicios {
    constructor() {
        this.reclamosBD = new ReclamosBD();
        this.notificacionesServicios = new NotificacionesServicios();
        this.usuariosOficinasBD = new UsuariosOficinasBD();
    }

    crear = (reclamo) => {
        const reclamoNuevo = {
            ...reclamo,
            fechaCreado: new Date().toISOString().slice(0, 19).replace('T', ' '),
            idReclamoEstado: 1
        }
        return this.reclamosBD.crear(reclamoNuevo);
    }

    buscarTodos = () => {
        //Switch para verificar el tipo de usuario, y de ahi a distintos metodos en bd?
        return this.reclamosBD.buscarTodos();
    }

    buscarReclamosUsuario = (id) => {
        //Switch para verificar el tipo de usuario, y de ahi a distintos metodos en bd?
        return this.reclamosBD.buscarReclamosUsuario(id);
    }

    /* 
    //consulta todos CON PAGINACION
    buscarTodos= (filter,limit,offset,order,asc)=>{
        //Obtengo los filtros para cada campo ya con el nombre que llevan en la BD.
        const sqlFilter = this.dbFieldsObj(filter);

        //Idem anterior pero para el campo por el que voy a hacer las ordenaciones.
        const sqlOrder = this.dbFieldsName(order);

        const strAsc = (asc) ? "ASC " : "DESC ";
        return this.reclamosBD.buscarTodos(sqlFilter, limit, offset, sqlOrder, strAsc);
    }
    */

    buscarPorId = (id) => {
        //console.log("Llega a BuscarPorId de reclamosServicios");
        return this.reclamosBD.buscarPorId(id);
    }

    /*
    actualizar= (idReclamo, reclamo)=>{
        //fechaFinalizado-fechaCancelado, idUsuarioFinalizador?
        const fecha=new Date().toISOString().replace('T', ' ').replace('Z', '');
        
        let reclamoActualizado= {...reclamo};

        if(reclamo.reclamoEstado===3){
            reclamoActualizado.fechaCancelado= fecha;
        }
        
        if(reclamo.reclamoEstado===4){
            reclamoActualizado.fechaFinalizado= fecha;
        }

        return this.reclamosBD.crear(idReclamo, reclamoActualizado);
    }
    */

    actualizar = (idReclamo, reclamo) => {
        //fechaFinalizado-fechaCancelado, idUsuarioFinalizador(este podria ya venir)?

        if (reclamo.reclamoEstado > 2) {
            let reclamoActualizado = { ...reclamo };
            const fecha = new Date().toISOString().slice(0, 19).replace('T', ' ');

            if (reclamo.reclamoEstado === 4) {
                reclamoActualizado.fechaFinalizado = fecha;
            } else {
                reclamoActualizado.fechaCancelado = fecha;
            }

            return this.reclamosBD.crear(idReclamo, reclamoActualizado);
        }

        return this.reclamosBD.crear(idReclamo, reclamo);
    }
    /*
    eliminado = (idReclamo) => {
        return this.reclamosBD.crear(idReclamo);
    }

    atenderReclamo = async (idReclamo, idReclamoEstado, idUsuario) => {
        const oficinaUsuario = await this.usuariosOficinasBD.obtenerOficinaUsuario(idUsuario);
        if (!oficinaUsuario) {
            throw new Error("No tienes una oficina asignada.");
        }

        const reclamo = await this.reclamosBD.obtenerReclamoPorId(idReclamo);
        if (!reclamo) {
            throw new Error("Reclamo no encontrado.");
        }

        if (reclamo.idOficina !== oficinaUsuario.idOficina) {
            throw new Error("No puedes atender reclamos de otra oficina.");
        }

        const exito = await this.reclamosBD.actualizarEstadoReclamo(idReclamo, idReclamoEstado);
        if (!exito) {
            throw new Error("Error al actualizar el estado del reclamo.");
        }

        return { mensaje: "Reclamo actualizado correctamente." };

    }
    */

    notificarCambio = async (idReclamo, datosReclamo) => {
        //verificacion de la existencia del reclamo en la bd
        const existe = await this.reclamosBD.buscarPorId(idReclamo);
        if (existe === null) {
            return { estado: false, mensaje: "No se pudo encontrar reclamo nro: " + idReclamo };
        }

        //modifico el reclamo en la bd
        const modificado = await this.reclamosBD.actualizar(idReclamo, datosReclamo);
        if (!modificado) {
            return { estado: false, mensaje: "No se pudo actualizar el reclamo nro: " + idReclamo };
        }

        //busco los datos del cliente para armar el correo
        const datosClienteReclamo = await this.reclamosBD.buscarClientePorReclamo(idReclamo);
        if (!datosClienteReclamo) {
            return { estado: false, mensaje: "No se pudo encontrar el cliente del reclamo nro: " + idReclamo };
        }

        const datosCorreo = {
            nombre: datosClienteReclamo[0].nombre,
            correoElectronico: datosClienteReclamo[0].correoElectronico,
            reclamo: idReclamo,
            estado: datosClienteReclamo[0].estado
        };
        //console.log("datos correo "+{datosCorreo});

        //envio el correo y retorno
        return await this.notificacionesServicios.enviarCorreo(datosCorreo);
    }

    cancelarReclamo = async (idReclamo, datosReclamo) => {
        // verificar si existe el reclamo y se puede modificar
        const existe = await this.reclamosBD.esCancelable(idReclamo);
        if (existe === null) {
            return { estado: false, mensaje: 'El reclamo con ese id no existe o no se puede cancelar.' };
        }

        const modificado = await this.reclamosBD.actualizar(idReclamo, datosReclamo);
        if (!modificado) {
            return { estado: false, mensaje: 'Reclamo no cancelado' };

        }

        // buscar los datos del cliente
        const datosClienteReclamo = await this.reclamos.buscarInformacionClientePorReclamo(idReclamo);
        if (!datosClienteReclamo) {
            return { estado: false, mensaje: 'Faltan datos de cliente' };
        }

        const datosCorreo = {
            nombre: datosClienteReclamo[0].nombre,
            correoElectronico: datosClienteReclamo[0].correoElectronico,
            reclamo: idReclamo,
            estado: datosClienteReclamo[0].estado,
        }
        
        // enviar la notificacion
        return await this.notificaciones.enviarCorreo(datosCorreo);
    }

    coincidenciaReclamoOficina = async (idUsuario, idReclamo) => {
        return await this.reclamosBD.coincidenciaReclamoOficina(idUsuario, idReclamo);
    }


    generarInforme = async (formato) => {
        if (formato === 'pdf') {

            return await this.reportePdf();

        } else if (formato === 'csv') {

            return await this.reporteCsv();

        }
    }

    reportePdf = async () => {
        const datosReporte = await this.reclamosBD.buscarDatosReportePdf();

        if (!datosReporte || datosReporte.length === 0) {
            return { estado: false, mensaje: 'Sin datos para el reporte' };
        }

        const pdf = await this.informes.informeReclamosPdf(datosReporte);

        return {
            buffer: pdf,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'inline; filename="reporte.pdf"'
            }
        };
    }

    reporteCsv = async () => {
        const datosReporte = await this.reclamosBD.buscarDatosReporteCsv();

        if (!datosReporte || datosReporte.length === 0) {
            return { estado: false, mensaje: 'Sin datos para el reporte' };
        }

        const csv = await this.informes.informeReclamosCsv(datosReporte);
        return {
            path: csv,
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': 'attachment; filename="reporte.csv"'
            }
        };

    }


}


