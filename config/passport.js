import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import UsuariosServicios from "../servicios/usuariosServicios.js";
import dotenv from "dotenv";

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
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET
        //,ignoreExpiration:true
    },
    async (jwtPayload, done) => {
        const usuariosServicios = new UsuariosServicios();
        const usuario = usuariosServicios.buscarPorId(jwtPayload.idUsuario);
        if (!usuario) {
            return done(null, false, { mensaje: "Token incorrecto." });
        }
        return done(null, usuario);
    }
)

export { estrategia, validacion };