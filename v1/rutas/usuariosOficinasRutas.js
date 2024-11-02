import express from 'express';
import UsuariosOficinasControlador from '../../controladores/usuariosOficinasControlador.js';

const router = express.Router();

const usuariosOficinasControlador = new UsuariosOficinasControlador();

router.get('/', usuariosOficinasControlador.buscarTodos);
router.get('/:id', usuariosOficinasControlador.buscarPorId);
router.post('/', usuariosOficinasControlador.crear);
router.put('/:id', usuariosOficinasControlador.actualizar);
//router.patch('/:id', usuariosOficinasControlador.actualizarParcialmente);
router.patch('/:id', usuariosOficinasControlador.eliminar);

export { router };