import express from "express";
import ReclamosControlador from "../../controladores/reclamosControlador.js";

const router = express.Router();

const reclamosControlador = new ReclamosControlador();

router.get("/reclamos", reclamosControlador.buscarTodos);
router.get("/reclamos/:idReclamo", reclamosControlador.buscarPorId);
router.post("/reclamos", reclamosControlador.crear);
router.put("/reclamos/:idReclamo", reclamosControlador.actualizar);
router.patch("/reclamos/:idReclamo", reclamosControlador.actualizarParcialmente);
router.delete("/reclamos/:idReclamo", reclamosControlador.eliminar);


export { router };