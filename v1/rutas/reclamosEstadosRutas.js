import express from "express";
import ReclamosEstadosControlador from "../../controladores/reclamosEstadosControlador.js";

const router = express.Router();

const reclamosEstadosControlador = new ReclamosEstadosControlador();

//estas completan la url del app.use en index
router.post("/", reclamosEstadosControlador.crear);
router.get("/", reclamosEstadosControlador.buscarTodos);
router.get("/:idReclamoEstado", reclamosEstadosControlador.buscarPorId);
router.put("/:idReclamoEstado", reclamosEstadosControlador.actualizar);
router.delete("/:idReclamoEstado", reclamosEstadosControlador.eliminar);
/*
router.patch();
*/

export { router };