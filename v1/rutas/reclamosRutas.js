import express from "express";
import ReclamosControlador from "../../controladores/reclamosControlador.js";

const router = express.Router();

const reclamosControlador = new ReclamosControlador();

router.post("/reclamos", reclamosControlador.crear);
router.get("/reclamos", reclamosControlador.buscarTodos);
router.get("/reclamos/:idReclamo", reclamosControlador.buscarPorId);
router.put("/reclamos/:idReclamo", reclamosControlador.actualizar);
router.delete("/reclamos/:idReclamo", reclamosControlador.eliminar);
/*
router.patch();
*/

export { router };