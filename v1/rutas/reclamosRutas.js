import express from "express";
import ReclamosControlador from "../../controladores/reclamosControlador.js";

const router = express.Router();

const reclamosControlador = new ReclamosControlador();

router.get("/reclamos", reclamosControlador.buscarTodos);
router.get("/reclamos/:idReclamo", reclamosControlador.buscarPorId);
/* 
router.put();
router.post();
router.patch();
router.delete();
*/

export { router };