import express from "express";
import UsuariosTiposControlador from "../../controladores/usuariosTiposControlador.js";

const router = express.Router();

const usuariosTiposControlador = new UsuariosTiposControlador();

//estas completan la url del app.use en index
router.post("/", autorizarUsuario([1]), usuariosTiposControlador.crear);
router.get("/", autorizarUsuario([1]), usuariosTiposControlador.buscarTodos);
router.get("/:idUsuarioTipo", autorizarUsuario([1]), usuariosTiposControlador.buscarPorId);
router.put("/:idUsuarioTipo", autorizarUsuario([1]), usuariosTiposControlador.actualizar);
router.patch("/:idUsuarioTipo", autorizarUsuario([1]), usuariosTiposControlador.eliminar);
/*
router.patch("/:idUsuarioTipo", usuariosTiposControlador.actualizarParcialmente);
*/

export { router };