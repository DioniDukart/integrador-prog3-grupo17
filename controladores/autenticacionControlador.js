import jwt from "jasonwebtoken";
import passport from "passport";
import dotenv from "dotenv";

dotenv.config();

export default class AutenticacionControlador {
    login = async (req, res) => {
        //autentica de forma local (estrategia de passport.js), no guardar sesion, dame el usuario
        passport.authenticate("local", { session: false }, (err, usuario, info) => {
            if (err || !usuario) {
                return res.status(400).json({
                    estado: "Falla",
                    mensaje: "Solicitud incorrecta"
                });
            }

            //armo el token y lo envio en respuesta
            req.login(usuario, { session: false }, (err) => {
                if (err) {
                    res.send(err);
                }

                //datos de usuario, clave para firmar, tiempo de expiracion
                const token = jwt.sign(usuario, process.env.JWT_SECRET, { expiresIn: "10m" });
                return res.status(200).send(
                    { estado: "Ok", token: token }
                );
            });
        })(req, res);
    }
}