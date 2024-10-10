import { Router } from 'express';
import ReclamosTipoControlador from '.../controladores/reclamosTipoControlador.js';

const router = Router();
const reclamosTipoControlador = new ReclamosTipoControlador();

// Define las rutas y asocia los métodos del controlador
router.get('/', reclamosTipoControlador.getAllTiposReclamo);
router.get('/:id', reclamosTipoControlador.getTipoReclamoById);
router.post('/', reclamosTipoControlador.createTipoReclamo);
router.put('/:id', reclamosTipoControlador.updateTipoReclamo);
router.delete('/:id', reclamosTipoControlador.deleteTipoReclamo);

export default router;
