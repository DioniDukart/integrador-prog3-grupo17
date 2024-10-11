import express from "express";
import UsuariosTipoControlador from "../../controladores/usuarioTipoControlador.js";
const router = express.Router();



const UsuariosTipoControlador = new UsuariosTipoControlador();


router.post('/UsuarioTipo', UsuariosTipoControlador.crear);


router.get('/tiposUsuario', UsuariosTipoControlador.buscarTodos);


router.get('/tiposUsuario/:idTipoUsuario', UsuariosTipoControlador.buscarPorId);

// Actualizar un tipo de usuario
router.put('/tiposUsuario/:idTipoUsuario', UsuariosTipoControlador.actualizar);

// Eliminar un tipo de usuario
router.delete('/tiposUsuario/:idTipoUsuario', UsuariosTipoControlador.eliminar);

export { router };
