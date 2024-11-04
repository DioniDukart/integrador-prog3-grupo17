import ReclamosBD from "../bd/reclamosBD.js";
import NotificacionesServicios from "./notificacionesServicios.js";

export default class ReclamosServicios {
    constructor() {
        this.reclamosBD = new ReclamosBD();
        this.notificacionesServicios = new NotificacionesServicios();
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

    eliminado = (idReclamo) => {
        return this.reclamosBD.crear(idReclamo);
    }

    notificarCambio = async (idReclamo, datosReclamo) => {
        //verificacion de la existencia del reclamo en la bd
        const exist = await this.reclamosBD.buscarPorId(idReclamo);
        if (exist === null) {
            return { estado: false, mensaje: "No se pudo encontrar reclamo con el ID: " + idReclamo };
        }

        //modifico el reclamo en la bd
        const modifcado = await this.reclamosBD.actualizar(idReclamo, datosReclamo);
        if (!modifcado) {
            return { estado: false, mensaje: "No se pudo actualizar el reclamo con el ID: " + idReclamo };
        }

        //busco los datos del cliente para armar el correo
        const datosClienteReclamo = await this.reclamosBD.buscarClientePorReclamo(idReclamo);
        if (!cliente) {
            return { estado: false, mensaje: "No se pudo encontrar el cliente del reclamo: " + idReclamo };
        }

        const datosCorreo = {
            nombre: datosClienteReclamo[0].nombre,
            correoElectronico: datosClienteReclamo[0].correoElectronico,
            reclamo: idReclamo,
            estado: datosClienteReclamo[0].estado
        };

        //envio el correo y retorno
        return await this.notificacionesServicios.enviarCorreo(datosCorreo);
    }

    cancelarReclamo = async (idReclamo, datosReclamo) => {
        // verificar si existe el reclamo y se puede modificar
        const existe = await this.reclamosBD.esCancelable(idReclamo);
        if (existe === null) {
            return { estado: false, mensaje: 'idReclamo no existe / Ya no se puede cancelar.' };
        }

        const modificado = await this.reclamosBD.actualizar(idReclamo, datosReclamo);
        if (!modificado) {
            return { estado: false, mensaje: 'Reclamo no cancelado' };
        }

        // buscar los datos del cliente
        const cliente = await this.reclamos.buscarInformacionClientePorReclamo(idReclamo);
        if (!cliente) {
            return { estado: false, mensaje: 'Faltan datos de cliente' };
        }

        const datosCorreo = {
            nombre: cliente[0].cliente,
            correoElectronico: cliente[0].correoElectronico,
            reclamo: idReclamo,
            estado: cliente[0].estado,
        }
        // enviar la notificacion
        return await this.notificaciones.enviarCorreo(datosCorreo);
    }
}