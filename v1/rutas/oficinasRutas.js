import express from "express";
import OficinasControlador from "../../controladores/oficinasControlador.js";

const router = express.Router();

const oficinasControlador = new OficinasControlador();

//estas completan la url del app.use en index
router.get("/", oficinasControlador.buscarTodas);
router.get("/:idOficina", oficinasControlador.buscarPorId);
router.post("/", oficinasControlador.crear);
router.put("/:idOficina", oficinasControlador.actualizar);
//router.patch("/:idOficina", oficinasControlador.actualizarParcialmente);
router.patch("/:idOficina", oficinasControlador.eliminar);

// estas rutas sirven para agregar y quitar empleados
router.post("/agregar-empleado/:idOficina", oficinasControlador.agregarEmpleado);
router.post("/quitar-empleado/:idOficina", oficinasControlador.quitarEmpleado);

export { router };