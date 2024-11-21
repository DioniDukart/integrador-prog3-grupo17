import jwt from 'jsonwebtoken';
import passport from 'passport';
import dotenv from "dotenv";

dotenv.config();

export default class AutenticacionControlador {
    login = async (req, res) => {
        //autentica de forma local (estrategia de passport.js), no guardar sesion, dame el usuario
        passport.authenticate('local', { session: false },
            (err, usuario, info) => { //la arrow recibe  el usuario que se encontro en la estrategia configurada
                if (err || !usuario) {
                    return res.status(400).json({
                        estado: "Falla",
                        mensaje: "Solicitud incorrecta."
                    });
                }

                //armo el token y lo envio en respuesta
                req.login(usuario, { session: false }, (err) => {
                    if (err) {
                        res.send(err);
                    }

                    //datos de usuario, clave para firmar, tiempo de expiracion
                    const token = jwt.sign(usuario, process.env.JWT_SECRET, { expiresIn: '1h' });
                    //console.log("se creo el token: ", token)
                    return res.status(200).send(
                        { estado: "Ok", token: token }
                    );
                });
            })(req, res);
    }
}