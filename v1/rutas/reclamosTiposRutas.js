import express from "express";
import ReclamosTiposControlador from "../../controladores/reclamosTiposControlador.js";
import autorizarUsuario from '../../middlewares/autorizarUsuario.js';


const router = express.Router();
const reclamosTiposControlador = new ReclamosTiposControlador();

// Define las rutas y asocia los métodos del controlador

router.get('/', autorizarUsuario([1]), reclamosTiposControlador.buscarTodos);

router.get('/:idReclamoTipo', autorizarUsuario([1]), reclamosTiposControlador.buscarPorId);

router.post('/', autorizarUsuario([1]), reclamosTiposControlador.crear);

router.put('/:idReclamoTipo', autorizarUsuario([1]), reclamosTiposControlador.actualizar);

router.patch('/:idReclamoTipo', autorizarUsuario([1]), reclamosTiposControlador.eliminar);

//router.patch('/:id', reclamosTiposControlador.actualizarParcialmente);

export { router };