import express from "express";
import AutenticacionControlador from "../../controladores/autenticacionControlador.js";

import { check } from "express-validator";
import { validarCampos } from "../../middlewares/validarCampos.js";

const router = express.Router();
const autenticacionControlador = new AutenticacionControlador();

router.post("/login",
    [
        check('correoElectronico', 'El correo electronico es requerido.').not().isEmpty(),
        check('correoElectronico', 'El correo electronico no tiene formato valido.').isEmail(),
        check('contrasenia', 'La contrasenia es requerida.').not().isEmpty(),
        validarCampos
    ],
    autenticacionControlador.login);

export { router };