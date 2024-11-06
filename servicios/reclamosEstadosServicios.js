import ReclamosEstadosBD from "../bd/reclamosEstadosBD.js";

export default class ReclamosEstadosServicios {
    constructor() {
        this.reclamosEstadosBD = new ReclamosEstadosBD();
    }

    crear = (reclamoEstado) => {
        return this.reclamosEstadosBD.crear(reclamoEstado);
    }

    buscarTodos = () => {
        return this.reclamosEstadosBD.buscarTodos();
    }

    buscarPorId = (idReclamoEstado) => {
        return this.reclamosEstadosBD.buscarPorId(idReclamoEstado);
    }

    actualizar = (idReclamoEstado, datos) => {
        return this.reclamosEstadosBD.actualizar(idReclamoEstado, datos);
    }

    eliminar = (idReclamoEstado) => {
        return this.reclamosEstadosBD.eliminar(idReclamoEstado);
    }

    cancelar = (idReclamoEstado) => {
        return this.reclamosEstadosBD.cancelar(idReclamoEstado);
    }
}