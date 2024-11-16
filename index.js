import express from "express";
import dotenv from "dotenv";

/*
import nodemailer from "nodemailer";

import nodemailer from "nonodemailer";
import handlebars from "handlebars";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
 */
import cors from "cors";

import passport from "passport";
import { estrategia, validacion } from "./config/passport.js";

const app = express();
dotenv.config();
const puerto = process.env.PUERTO;

//middleware
app.use(
    //"lo que llegue en el body de las solicitud procesarlo en formato json"
    express.json() //esto es como pasar una callback?
);
/*
//redundante respecto a express.json
import bodyParser from 'body-parser';
app.use(
    bodyParser.json()
);
 */

app.use(cors());

passport.use(estrategia);
passport.use(validacion);
app.use(passport.initialize());

// morgan
/*
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'accesos.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));
*/

import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";


const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API REST - Integrador Final PROG3- Grupo 17 2024',
            version: '1.0.0',
            description: 'API REST de gestión de reclamos.'
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ],
        servers: [
            {
                url: 'http://localhost:3555'
            }
        ]
    },
    apis: ['./v1/rutas/*.js']
};

//genera la especificacion de swagger
const swaggerDocs = swaggerJsdoc(swaggerOptions);

//import validateContentType from './middlewares/validateContentType.js';

import { router as v1Autenticacion } from "./v1/rutas/autenticacionRutas.js";
import { router as v1Reclamos } from "./v1/rutas/reclamosRutas.js";
import { router as v1ReclamosEstados } from "./v1/rutas/reclamosEstadosRutas.js";
import { router as v1Usuarios } from './v1/rutas/usuariosRutas.js';
import { router as v1UsuariosTipos } from "./v1/rutas/usuariosTiposRutas.js";
import { router as v1Oficinas } from "./v1/rutas/oficinasRutas.js";
import { router as v1UsuariosOficinas } from "./v1/rutas/usuariosOficinasRutas.js";
import { router as v1ReclamosTipos } from "./v1/rutas/reclamosTiposRutas.js";

app.use("/api/v1/autenticacion", v1Autenticacion);
app.use("/api/v1/reclamos", passport.authenticate("jwt", { session: false }), v1Reclamos); //pide autenticacion (cual sea el tipoUsuario) para el acceso a la ruta;
app.use("/api/v1/reclamos-estados", passport.authenticate("jwt", { session: false }), v1ReclamosEstados);
app.use('/api/v1/usuarios', passport.authenticate("jwt", { session: false }), v1Usuarios);
app.use("/api/v1/usuarios-tipos", passport.authenticate("jwt", { session: false }), v1UsuariosTipos);
app.use("/api/v1/oficinas", passport.authenticate("jwt", { session: false }), v1Oficinas);
app.use("/api/v1/usuarios-oficinas", passport.authenticate("jwt", { session: false }), v1UsuariosOficinas);
app.use("/api/v1/reclamos-tipos", passport.authenticate("jwt", { session: false }), v1ReclamosTipos);


//"swagger-ui-express sirve la interfaz Swagger"
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.post("/test-token", async (req, res) => {
    const usuario = req.body.usuario;
    console.log(usuario)
})

app.listen(puerto, () => {
    console.log(`Hola puerto ${puerto}!`);
});

/* 
//mail
//ya refactorizado
app.post("/notificacion", async (req, res) => {
    const correoUsuario = req.body.correoElectronico; // "correoElectronico" lit es como viene en la solicitud http

    const pathArchivo = fileURLToPath(import.meta.url); //me da la ubicacion "././index.js"
    const dir = path.dirname(`${pathArchivo}`); //me queda "././"

    const plantilla = fs.readFileSync(path.join(dir + "/utilidades/handlebars/plantilla.hbs"), "utf-8");

    const plantillaHandlebars = handlebars.compile(plantilla);

    //info con la que se rellena la plantilla handlebars
    const datos = {
        nombre: "nombre",
        nroReclamo: "reclamo",
        estado: "estado"//esto ver a futuro
    };

    const htmlCorreo = plantillaHandlebars(datos);

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.DIRECCION_CORREO,
            pass: process.env.CLAVE_CORREO
        }
    });

    const mailOptions = {
        from: "API Grupo 17 | Prog3", //"api",//puede no ir, quedaria el correo
        to: correoUsuario, //podria-deberia? poner el nombre del usuario, trayendolo de la bd o recibiendolo por body?
        subject: "Actualización de reclamo.",
        html: htmlCorreo
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error al enviar el mail: ", error);
        } else {
            console.log("Mail enviado: ", info.response);
            res.send(true);
        }
    });

});
*/