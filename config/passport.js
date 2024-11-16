import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import UsuariosServicios from '../servicios/usuariosServicios.js';
import dotenv from 'dotenv';

dotenv.config();

//define la validacion de usuarios
const estrategia = new LocalStrategy(
    {
        usernameField: 'correoElectronico', //si no se llama usernameField no entiende?
        passwordField: 'contrasenia' //si no se llama passwordField no entiende?
    },
    async (correoElectronico, contrasenia, done) => {
        try {
            const usuariosServicios = new UsuariosServicios();
            const usuario = await usuariosServicios.buscarLogin(correoElectronico, contrasenia);
            if (!usuario) {
                return done(null, false, { mensaje: "Login incorrecto." });
            }
            return done(null, usuario, { mensaje: "Login correcto." });
        } catch (exc) {

            done(exc);
        }
    }

);

//define la validacion de tokens
const validacion = new JwtStrategy(
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //lo extrae del header auth de la solicitud http
        secretOrKey: process.env.JWT_SECRET,
        //ignoreExpiration: true //por defecto se evalúa el campo de expiración a menos que le diga que lo ignore
    },
    async (jwtPayload, done) => {
        //console.log("JWT Payload:", jwtPayload);
        const usuariosServicios = new UsuariosServicios();

        try {
            const usuario = await usuariosServicios.buscarPorIdValidacion(jwtPayload.idUsuario);
            if (!usuario) {
                //console.error("No se encontro el usuario del token en la Validacion JWT.");
                return done(null, false, { mensaje: "Token incorrecto." });
            }
            //console.error("Validacion JWT correcta: ", usuario);
            return done(null, usuario);
        } catch (error) {
            console.error("Error en validación JWT:", error);
            return done(error, false);
        }
    }
)
/*
//define la validacion de tokens
const validacion = new JwtStrategy(
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
        //ignoreExpiration: true //por defecto se evalúa el campo de expiración a menos que le diga que lo ignore
    },
    async (jwtPayload, done) => {
        const usuariosServicios = new UsuariosServicios();
        //console.log(jwtPayload.idUsuario+ " validacion en passport");
        const usuario = await usuariosServicios.buscarPorIdValidacion(jwtPayload.idUsuario);
        //console.log(usuario.usuario+ " validacion en passport.js");
        //console.log(!usuario+ " validacion en passport"); //funciona bien
        if (!usuario) {
            return done(null, false, { mensaje: "Token incorrecto." });
        }

        return done(null, usuario);//req.user //se agregan los datos del usuario que se obtuvieron desde la bd
    }
)
*/

export { estrategia, validacion };