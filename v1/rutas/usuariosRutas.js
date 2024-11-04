import express from "express";
import UsuariosControlador from "../../controladores/usuariosControlador.js";
import autorizarUsuario from "../../middlewares/autorizarUsuario.js"

const router = express.Router();

const usuariosControlador = new UsuariosControlador();

//estas completan la url del app.use en index
router.post("/", usuariosControlador.crear);
router.get("/", usuariosControlador.buscarTodos);
router.get("/:idUsuario", usuariosControlador.buscarPorId);
router.put("/:idUsuario", usuariosControlador.actualizar);
router.patch("/:idUsuario", usuariosControlador.eliminar);


//idTipoUsuario, 1=Admin 2=Empleado 3=Cliente
router.get('/empleadosTodos', autorizarUsuario([1]), usuariosControlador.buscarEmpleadosTodos);

router.get('/empleadosLibres', autorizarUsuario([1]), usuariosControlador.buscarEmpleadosSinOficina);

router.get('/empleadosOficinas', autorizarUsuario([1]), usuariosControlador.buscarEmpleadosConOficina);

//router.post('/empleados/idUsuario', autorizarUsuario([1]), usuariosControlador.);
/*
router.patch("/:idUsuario", usuariosControlador.actualizarParcialmente);
*/

export { router };