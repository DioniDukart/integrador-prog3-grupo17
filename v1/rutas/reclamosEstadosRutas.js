import express from "express";
import ReclamosEstadosControlador from "../../controladores/reclamosEstadosControlador.js";

const router = express.Router();

const reclamosEstadosControlador = new ReclamosEstadosControlador();

router.post("/reclamos-estados", reclamosEstadosControlador.crear);
router.get("/reclamos-estados", reclamosEstadosControlador.buscarTodos);
router.get("/reclamos-estados/:idReclamoEstado", reclamosEstadosControlador.buscarPorId);
router.put("/reclamos-estados/:idReclamoEstado", reclamosEstadosControlador.actualizar);
router.delete("/reclamos-estados/:idReclamoEstado", reclamosEstadosControlador.eliminar);
/*
router.patch();
*/

export { router };