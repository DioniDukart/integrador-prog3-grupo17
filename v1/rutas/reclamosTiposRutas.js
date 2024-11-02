import express from "express";
import ReclamosTiposControlador from "../../controladores/reclamosTiposControlador.js";

const router = express.Router();
const reclamosTiposControlador = new ReclamosTiposControlador();

// Define las rutas y asocia los métodos del controlador
router.get('/', reclamosTiposControlador.buscarTodos);
router.get('/:id', reclamosTiposControlador.buscarPorId);
router.post('/', reclamosTiposControlador.crear);
router.put('/:id', reclamosTiposControlador.actualizar);
//router.patch('/:id', reclamosTiposControlador.actualizarParcialmente);
router.patch('/:id', reclamosTiposControlador.eliminar);

export { router };

//Falta testear