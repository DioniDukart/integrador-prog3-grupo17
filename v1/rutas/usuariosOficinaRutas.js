
import express from 'express';
import UsuariosOficinaControlador from '../../controladores/usuariosOficinaControlador.js';

const router = express.Router();

const usuariosOficinaControlador = new UsuariosOficinaControlador();

router.get('/usuarios-oficinas', usuariosOficinaControlador.buscarTodos);
router.get('/usuarios-oficinas/:id', usuariosOficinaControlador.buscarPorId);
router.post('/usuarios-oficinas', usuariosOficinaControlador.crear);
router.put('/usuarios-oficinas/:id', usuariosOficinaControlador.actualizar);
router.patch('/usuarios-oficinas/:id', usuariosOficinaControlador.actualizarParcialmente);
router.delete('/usuarios-oficinas/:id', usuariosOficinaControlador.eliminar);

export { router };
