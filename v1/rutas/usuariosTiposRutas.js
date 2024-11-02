import express from "express";
import UsuariosTiposControlador from "../../controladores/usuariosTiposControlador.js";

const router = express.Router();

const usuariosTiposControlador = new UsuariosTiposControlador();

//estas completan la url del app.use en index
router.post("/", usuariosTiposControlador.crear);
router.get("/", usuariosTiposControlador.buscarTodos);
router.get("/:idUsuarioTipo", usuariosTiposControlador.buscarPorId);
router.put("/:idUsuarioTipo", usuariosTiposControlador.actualizar);
router.patch("/:idUsuarioTipo", usuariosTiposControlador.eliminar);
/*
router.patch("/:idUsuarioTipo", usuariosTiposControlador.actualizarParcialmente);
*/

export { router };