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
    crear = async (datos) => {
        const creado = await reclamosTiposBD.crear(datos);
        if (!creado) {
            return { estado: false, mensaje: "No se creo el reclamo." }
        } else {
            return { estado: true, mensaje: "Reclamo creado.", data: creado }
        }

    }

    // Actualizar un tipo de reclamo por ID
    actualizar = async (id, datosActualizados) => {
        //return reclamosTiposBD.actualizar(id, datosActualizados);
        const existe = await this.reclamosTiposBD.buscarPorId(id);

        if (existe === null) {
            return { estado: false, mensaje: "No existe reclamo con ese Id" };
        }

        const modificado = await this.reclamosTiposBD.actualizar(id, datosActualizados);

        if (modificado) {
            return { estado: true, mensaje: "El reclamo ha sido modificado.", data: modificado };
        } else {
            return { estado: false, mensaje: "El reclamo NO ha sido modificado." };
        }
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