import express from "express";
import ReclamosControlador from "../../controladores/reclamosControlador.js";

const router = express.Router();

const reclamosControlador = new ReclamosControlador();

//estas completan la url del app.use en index
router.post("/", reclamosControlador.crear);
router.get("/", reclamosControlador.buscarTodos);
router.get("/:idReclamo", reclamosControlador.buscarPorId);
router.put("/:idReclamo", reclamosControlador.actualizar);
router.delete("/:idReclamo", reclamosControlador.eliminar);
/*
router.patch();
*/

export { router };