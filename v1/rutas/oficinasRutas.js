import express from "express";
import OficinasControlador from "../../controladores/oficinasControlador.js";
import autorizarUsuario from "../../middlewares/autorizarUsuario.js";

const router = express.Router();

const oficinasControlador = new OficinasControlador();

//estas completan la url del app.use en index
router.get("/", autorizarUsuario([1]), oficinasControlador.buscarTodas);
router.get("/:idOficina", autorizarUsuario([1]), oficinasControlador.buscarPorId);
router.post("/", autorizarUsuario([1]), oficinasControlador.crear);
router.put("/:idOficina", autorizarUsuario([1]), oficinasControlador.actualizar);
//router.patch("/:idOficina", oficinasControlador.actualizarParcialmente);
router.patch("/:idOficina", autorizarUsuario([1]), oficinasControlador.eliminar);

// estas rutas sirven para agregar y quitar empleados
router.post("/agregar-empleado/:idOficina", autorizarUsuario([1]), oficinasControlador.agregarEmpleado);
router.post("/quitar-empleado/:idOficina", autorizarUsuario([1]), oficinasControlador.quitarEmpleado);

export { router };