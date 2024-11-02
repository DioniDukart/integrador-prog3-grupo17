import { validationResult } from "express-validator";

//esto chequea las "pruebas" del array de la ruta
export const validarCampos = (req, res, next) => {
    const errores = validationResult(req);

    if (!errores.isEmpty()) {
        return res.status(400).json({
            estado: "Fallo",
            mensaje: errores.mapped()
        })
    }

    next();
};