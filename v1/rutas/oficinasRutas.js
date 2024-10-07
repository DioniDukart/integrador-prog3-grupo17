import express from "express";
import OficinasControlador from "../../controladores/oficinasControlador.js";

const router = express.Router();

const oficinasControlador = new OficinasControlador();

router.get("/oficinas", oficinasControlador.buscarTodas);
router.get("/oficinas/:idOficina", oficinasControlador.buscarPorId);
router.post("/oficinas", oficinasControlador.crear);
router.put("/oficinas/:idOficina", oficinasControlador.actualizar);
router.patch("/oficinas/:idOficina", oficinasControlador.actualizarParcialmente);
router.delete("/oficinas/:idOficina", oficinasControlador.eliminar);


export { router };