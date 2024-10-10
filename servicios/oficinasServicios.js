import OficinasBD from "../bd/oficinasBD.js";

export default class OficinasServicios {
    constructor() {
        this.oficinasBD = new OficinasBD();
    }

    crear = (oficina) => {
        return this.oficinasBD.crear(oficina);
    };

    
    buscarTodas = () => {
        return this.oficinasBD.buscarTodas();
    };

   
    buscarPorId = (idOficina) => {
        return this.oficinasBD.buscarPorId(idOficina);
    };

   
    actualizar = (idOficina, datos) => {
        return this.oficinasBD.actualizar(idOficina, datos);
    };

    eliminar = (idOficina) => {
        return this.oficinasBD.eliminar(idOficina);
    };
}
