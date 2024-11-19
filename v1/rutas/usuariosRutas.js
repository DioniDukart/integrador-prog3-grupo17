import express from "express";
import UsuariosControlador from "../../controladores/usuariosControlador.js";
import autorizarUsuario from '../../middlewares/autorizarUsuario.js';
import passport from "passport";
import multer from "multer";
import { storage } from "../../config/multer.js";

const router = express.Router();


const usuariosControlador = new UsuariosControlador();

const upload = multer({ storage });

//estas completan la url del app.use en index
router.post("/", passport.authenticate("jwt", { session: false }), autorizarUsuario([1]), usuariosControlador.crear);
router.post("/cliente/crear", usuariosControlador.crearCliente);
router.get("/", passport.authenticate("jwt", { session: false }), autorizarUsuario([1]), usuariosControlador.buscarTodos);
router.get("/:idUsuario", passport.authenticate("jwt", { session: false }), autorizarUsuario([1]), usuariosControlador.buscarPorId);
router.put("/:idUsuario", passport.authenticate("jwt", { session: false }), autorizarUsuario([1]), usuariosControlador.actualizar);
router.patch("/:idUsuario", passport.authenticate("jwt", { session: false }), autorizarUsuario([1]), usuariosControlador.eliminar);


router.patch("/clientes/actualizarPerfil", upload.single("imagen"), passport.authenticate("jwt", { session: false }), autorizarUsuario([3]), usuariosControlador.actualizarPerfilCliente);
router.get("/:idUsuario", passport.authenticate("jwt", { session: false }), autorizarUsuario([3]), usuariosControlador.buscarImagen);

//idTipoUsuario, 1=Admin 2=Empleado 3=Cliente 
router.post("/empleados/crear", passport.authenticate("jwt", { session: false }), autorizarUsuario([1]), usuariosControlador.crearEmpleado);

router.get('/empleados/buscarTodos', passport.authenticate("jwt", { session: false }), autorizarUsuario([1]), usuariosControlador.buscarEmpleadosTodos); //averiguar por que no funcionaba como solo '/empleadosTodos'
router.get('/empleados/buscarLibres/', passport.authenticate("jwt", { session: false }), autorizarUsuario([1]), usuariosControlador.buscarEmpleadosSinOficina);
router.get('/empleados/buscarConOficinas/', passport.authenticate("jwt", { session: false }), autorizarUsuario([1]), usuariosControlador.buscarEmpleadosConOficina);

router.patch('/empleados/modificar/:idEmpleado', passport.authenticate("jwt", { session: false }), autorizarUsuario([1]), usuariosControlador.actualizarEmpleado);
router.patch("/empleados/eliminar/:idUsuario", passport.authenticate("jwt", { session: false }), autorizarUsuario([1]), usuariosControlador.eliminarEmpleado);

export { router };