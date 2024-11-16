import express from "express";
import ReclamosEstadosControlador from "../../controladores/reclamosEstadosControlador.js";
import autorizarUsuario from '../../middlewares/autorizarUsuario.js';

const router = express.Router();

const reclamosEstadosControlador = new ReclamosEstadosControlador();

//estas completan la url del app.use en index
router.post("/", autorizarUsuario([1]), reclamosEstadosControlador.crear);
router.get("/", autorizarUsuario([1]), reclamosEstadosControlador.buscarTodos);
router.get("/:idReclamoEstado", autorizarUsuario([1]), reclamosEstadosControlador.buscarPorId);
router.put("/:idReclamoEstado", autorizarUsuario([1]), reclamosEstadosControlador.actualizar);
router.patch("/:idReclamoEstado", autorizarUsuario([1]), reclamosEstadosControlador.eliminar);

/*
router.patch("/:idReclamoEstado", reclamosEstadosControlador.actualizarParcialmente);
*/
export { router };