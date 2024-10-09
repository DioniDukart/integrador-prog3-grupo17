import express from "express";
import UsuariosControlador from "../../controladores/usuariosControlador.js";

const router = express.Router();

const usuariosControlador = new UsuariosControlador();

router.post("/usuarios", usuariosControlador.crear);
router.get("/usuarios", usuariosControlador.buscarTodos);
router.get("/usuarios/:idUsuario", usuariosControlador.buscarPorId);
router.put("/usuarios/:idUsuario", usuariosControlador.actualizar);
router.delete("/usuarios/:idUsuario", usuariosControlador.eliminar);
/*
router.patch();
*/

export { router };