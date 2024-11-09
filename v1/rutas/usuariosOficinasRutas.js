import express from 'express';
import UsuariosOficinasControlador from '../../controladores/usuariosOficinasControlador.js';

const router = express.Router();

const usuariosOficinasControlador = new UsuariosOficinasControlador();

router.get('/', autorizarUsuario([1]), usuariosOficinasControlador.buscarTodos);
router.get('/:id', autorizarUsuario([1]), usuariosOficinasControlador.buscarPorId);
router.post('/', autorizarUsuario([1]), usuariosOficinasControlador.crear);
router.put('/:id', autorizarUsuario([1]), usuariosOficinasControlador.actualizar);
//router.patch('/:id', usuariosOficinasControlador.actualizarParcialmente);
router.patch('/:id', autorizarUsuario([1]), usuariosOficinasControlador.eliminar);
router.get('/:idUsuario/reclamos', autorizarUsuario([2]), usuariosOficinasControlador.obtenerReclamosPorOficina);

export { router };

