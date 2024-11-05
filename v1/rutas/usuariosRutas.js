import express from "express";
import UsuariosControlador from "../../controladores/usuariosControlador.js";

const router = express.Router();

const usuariosControlador = new UsuariosControlador();

//estas completan la url del app.use en index
router.post("/", usuariosControlador.crear);
router.get("/", usuariosControlador.buscarTodos);
router.get("/:idUsuario", usuariosControlador.buscarPorId);
router.put("/:idUsuario", usuariosControlador.actualizar);
router.patch("/:idUsuario", usuariosControlador.eliminar);
/*
router.patch("/:idUsuario", usuariosControlador.actualizarParcialmente);
*/
// Ruta específica para actualizar el perfil del cliente
router.put("/:idUsuario/perfilCliente", usuariosControlador.actualizarPerfilCliente);
export { router };