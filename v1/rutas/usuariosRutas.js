import express from "express";
import UsuariosControlador from "../../controladores/usuariosControlador.js";

const router = express.Router();

const usuariosControlador = new UsuariosControlador();

router.get("/usuarios", usuariosControlador.buscarTodos);
router.get("/usuarios/:idUsuario", usuariosControlador.buscarPorId);
router.post("/usuarios", usuariosControlador.crear);
router.put("/usuarios/:idUsuario", usuariosControlador.actualizar);
router.patch("/usuarios/:idUsuario", usuariosControlador.actualizarParcialmente);
router.delete("/usuarios/:idUsuario", usuariosControlador.eliminar);


export { router };