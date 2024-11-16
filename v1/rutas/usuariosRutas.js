import express from "express";
import UsuariosControlador from "../../controladores/usuariosControlador.js";
import autorizarUsuario from '../../middlewares/autorizarUsuario.js';

//import passport from "passport";

const router = express.Router();

const usuariosControlador = new UsuariosControlador();

//estas completan la url del app.use en index
router.post("/", autorizarUsuario([1]), usuariosControlador.crear);
router.get("/", autorizarUsuario([1]), usuariosControlador.buscarTodos);
router.get("/:idUsuario", autorizarUsuario([1]), usuariosControlador.buscarPorId);
router.put("/:idUsuario", autorizarUsuario([1]), usuariosControlador.actualizar);
router.patch("/:idUsuario", autorizarUsuario([1]), usuariosControlador.eliminar);


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
// Ruta específica para actualizar el perfil del cliente
router.put("/actualizarPerfilCliente/:idUsuario", autorizarUsuario([3]), usuariosControlador.actualizarPerfilCliente);
export { router };