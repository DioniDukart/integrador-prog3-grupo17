import UsuariosOficinasBD  from "../bd/usuariosOficinasBD.js";


export default class UsuariosOficinasServicios {
    constructor() {
        this.usuariosOficinasBD = new UsuariosOficinasBD();
    }


    async buscarTodos() {
        return await usuariosOficinasBD.buscarTodos(); // Populate para obtener la info de la oficina
    }

    async buscarPorId(id) {
        return await usuariosOficinasBD.buscarPorId(id);
    }

    async crear(datos) {
        //const nuevoUsuariosOficina = new usuariosOficinasBD(datos);
        //return await nuevoUsuariosOficina.save();
        
        return await usuariosOficinasBD.crear(datos);
    }

    async actualizar(id, datosActualizados) {
        return await usuariosOficinasBD.actualizar(id, datosActualizados);
    }
    /* 
    async actualizarParcialmente(id, datosParciales) {
        return await usuariosOficinasBD.findByIdAndUpdate(id, { $set: datosParciales }, { new: true });
    }
    */
    async eliminar(id) {
        return await usuariosOficinasBD.eliminar(id);
    }
    // Nuevo método para obtener los reclamos de la oficina del usuario
    async obtenerReclamosPorOficina(idUsuario) {
        return await this.usuariosOficinasBD.obtenerReclamosPorOficina(idUsuario);
    }
}
