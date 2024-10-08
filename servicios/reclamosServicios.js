import ReclamosBD from "../bd/reclamosBD.js";

export default class ReclamosServicios {
    constructor(){
        this.reclamosBD= new ReclamosBD();
    }
    
    crear= (reclamo)=>{
        const reclamoNuevo={
            ...reclamo,
            fechaCreado: new Date().toISOString().replace('T', ' ').replace('Z', ''),
            idReclamoEstado: 1
        }
        return this.reclamosBD.crear(reclamoNuevo);
    }

    buscarTodos= ()=>{
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

    buscarPorId= (id)=>{
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
    
    actualizar= (idReclamo, reclamo)=>{
        //fechaFinalizado-fechaCancelado, idUsuarioFinalizador(este podria ya venir)?

        if(reclamo.reclamoEstado>2){
            let reclamoActualizado= {...reclamo};
            const fecha=new Date().toISOString().replace('T', ' ').replace('Z', '');

            if(reclamo.reclamoEstado===4) {
                reclamoActualizado.fechaFinalizado = fecha;
            } else {
                reclamoActualizado.fechaCancelado = fecha;
            }

            return this.reclamosBD.crear(idReclamo, reclamoActualizado);
        }

        return this.reclamosBD.crear(idReclamo, reclamo);
    }

    eliminado= (idReclamo)=>{
        return this.reclamosBD.crear(idReclamo);
    }
}