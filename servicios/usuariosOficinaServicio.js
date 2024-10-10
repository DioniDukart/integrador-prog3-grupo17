import UsuariosOficina from '../modelos/UsuariosOficina.js';

class UsuariosOficinaServicio {
    async buscarTodos() {
        return await UsuariosOficina.find().populate('oficina'); // Populate para obtener la info de la oficina
    }

    async buscarPorId(id) {
        return await UsuariosOficina.findById(id).populate('oficina');
    }

    async crear(datos) {
        const nuevoUsuariosOficina = new UsuariosOficina(datos);
        return await nuevoUsuariosOficina.save();
    }

    async actualizar(id, datosActualizados) {
        return await UsuariosOficina.findByIdAndUpdate(id, datosActualizados, { new: true });
    }

    async actualizarParcialmente(id, datosParciales) {
        return await UsuariosOficina.findByIdAndUpdate(id, { $set: datosParciales }, { new: true });
    }

    async eliminar(id) {
        return await UsuariosOficina.findByIdAndDelete(id);
    }
}

export default UsuariosOficinaServicio;
