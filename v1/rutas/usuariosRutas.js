import express from "express";
import UsuariosControlador from "../../controladores/usuariosControlador.js";
import autorizarUsuario from '../../middlewares/autorizarUsuario.js';

//import passport from "passport";

const router = express.Router();

const usuariosControlador = new UsuariosControlador();

//estas completan la url del app.use en index
router.post("/", usuariosControlador.crear);
router.get("/", usuariosControlador.buscarTodos);
router.get("/:idUsuario", usuariosControlador.buscarPorId);
router.put("/:idUsuario", usuariosControlador.actualizar);
router.patch("/:idUsuario", usuariosControlador.eliminar);


//idTipoUsuario, 1=Admin 2=Empleado 3=Cliente
//averiguar por que no funcionaba como solo '/empleadosTodos'
router.post("/empleados/crear", autorizarUsuario([1]), usuariosControlador.crearEmpleado);

router.get('/empleados/buscarTodos', autorizarUsuario([1]), usuariosControlador.buscarEmpleadosTodos);

router.get('/empleados/buscarLibres/', autorizarUsuario([1]), usuariosControlador.buscarEmpleadosSinOficina);

router.get('/empleados/buscarConOficinas/', autorizarUsuario([1]), usuariosControlador.buscarEmpleadosConOficina);

router.patch('/empleados/modificar/:idEmpleado', autorizarUsuario([1]), usuariosControlador.actualizarEmpleado);

router.patch("/empleados/eliminar/:idUsuario", autorizarUsuario([1]), usuariosControlador.eliminarEmpleado);

/*
router.patch("/:idUsuario", usuariosControlador.actualizarParcialmente);
*/

export { router };