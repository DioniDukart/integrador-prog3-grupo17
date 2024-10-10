import express from "express";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import handlebars from "handlebars";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
dotenv.config();
const puerto = process.env.PUERTO;

//middleware
app.use(
    //"lo que llegue en el body de las solicitud procesarlo en formato json"
    express.json() //esto es como pasar una callback?
);

app.listen(puerto, () => {
    console.log(`Hola puerto ${puerto}!`);
});

import { router as v1Reclamos}  from "./v1/rutas/reclamosRutas.js";
app.use("/api/v1/reclamos", v1Reclamos);
/*
import {router as v1ReclamosEstados} from "./v1/rutas/reclamosEstadosRutas.js";
app.use("/api/v1/reclamos-estados", v1ReclamosEstados);

import {router as v1Usuarios} from "./v1/rutas/usuariosRutas.js";
app.use("/api/v1/usuarios", v1Usuarios);

import {router as v1UsuariosTipos} from "./v1/rutas/usuariosTiposRutas.js";
app.use("/api/v1/usuarios-tipos", v1UsuariosTipos);

import {router as v1Oficinas} from "./v1/rutas/oficinasRutas.js";
app.use("/api/v1/oficinas", v1Oficinas);

import {router as v1UsuariosOficinas} from "./v1/rutas/usuariosOficinasRutas.js";
app.use("/api/v1/usuarios-oficinas", v1UsuariosOficinas);

import {router as v1ReclamosTipos} from "./v1/rutas/reclamosTiposRutas.js";
app.use("/api/v1/reclamos-tipos", v1ReclamosTipos);
*/


//mail
app.post("/notificacion", async (req, res) => {
    const correoUsuario = req.body.correoElectronico; // "correoElectronico" lit es como viene en la solicitud http

    const pathArchivo = fileURLToPath(import.meta.url); //me da la ubicacion "././index.js"
    const dir = path.dirname(`${pathArchivo}`); //me queda "././"

    const plantilla = fs.readFileSync(path.join(dir + "/utilidades/handlebars/plantilla.hbs"), "utf-8");

    const plantillaHandlebars = handlebars.compile(plantilla);

    //info con la que se rellena la plantilla handlebars
    const datos = {
        nombre: "nombre1",
        nroReclamo: "reclamo1",
        estado: "estado1"//esto ver a futuro
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