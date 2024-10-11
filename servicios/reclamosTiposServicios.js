import ReclamosTiposBD from "../bd/reclamosTiposBD.js";

export default class ReclamosTiposServicios {
    constructor() {
        this.reclamosTiposBD = new ReclamosTiposBD();
    }

    // Buscar todos los tipos de reclamos
    buscarTodos = () => {
        return reclamosTiposBD.buscar();
    }

    // Buscar un tipo de reclamo por ID
    buscarPorId = (id) => {
        return reclamosTiposBD.buscarPorId(id);
    }

    // Crear un nuevo tipo de reclamo
    crear = (datos) => {
        //const nuevoReclamoTipo = new ReclamosTipo(datos);
        //return  nuevoReclamoTipo.save();
        return reclamosTiposBD.crear(datos);
    }

    // Actualizar un tipo de reclamo por ID
    actualizar = (id, datosActualizados) => {
        return reclamosTiposBD.actualizar(id, datosActualizados);
    }
    /*
    // Actualizar parcialmente un tipo de reclamo por ID
    actualizarParcialmente(id, datosParciales) {
        return  reclamosTiposBD.actualizarParcialmente(id, datosParciales);
    }
    */
    // Eliminar un tipo de reclamo (esto lo podrías modificar para hacer una eliminación lógica, cambiando el estado activo)
    eliminar = (id) => {
        return reclamosTiposBD.eliminar(id);
    }
}

//Falta testear