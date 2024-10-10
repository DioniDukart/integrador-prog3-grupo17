import ReclamoTipo from '../modelos/ReclamoTipo.js';

class ReclamoTipoServicio {
    // Buscar todos los tipos de reclamos
    async buscarTodos() {
        return await ReclamoTipo.find();
    }

    // Buscar un tipo de reclamo por ID
    async buscarPorId(id) {
        return await ReclamoTipo.findById(id);
    }

    // Crear un nuevo tipo de reclamo
    async crear(datos) {
        const nuevoReclamoTipo = new ReclamoTipo(datos);
        return await nuevoReclamoTipo.save();
    }

    // Actualizar un tipo de reclamo por ID
    async actualizar(id, datosActualizados) {
        return await ReclamoTipo.findByIdAndUpdate(id, datosActualizados, { new: true });
    }

    // Actualizar parcialmente un tipo de reclamo por ID
    async actualizarParcialmente(id, datosParciales) {
        return await ReclamoTipo.findByIdAndUpdate(id, { $set: datosParciales }, { new: true });
    }

    // Eliminar un tipo de reclamo (esto lo podrías modificar para hacer una eliminación lógica, cambiando el estado activo)
    async eliminar(id) {
        return await ReclamoTipo.findByIdAndDelete(id);
    }
}

export default ReclamoTipoServicio;
