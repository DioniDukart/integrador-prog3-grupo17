import express from "express";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import handlebars from "handlebars";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import reclamosTipoRoutes from './v1/rutas/reclamosTipoRutas.js';
import bodyParser from 'body-parser';


app.use(bodyParser.json());

// Rutas
app.use('/api/reclamosTipo', reclamosTipoRoutes);


// Ruta básica de prueba
app.get('/', (req, res) => {
  res.send('API funcionando correctamente');
});



//import { conexion } from "./bd/conexionBD.js";

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



//mail
app.post("/notificacion", (req, res) => {
    const correoCliente = req.body.correoElectronico; // "correoElectronico" lit es como viene en la solicitud http

    const pathArchivo = fileURLToPath(import.meta.url); //me da la ubicacion "././index.js"
    const dir = path.dirname(`${pathArchivo}`); //me queda "././"

    const plantilla = fs.readFileSync(path.join(dir + "/utilidades/handlebars/plantilla.hbs"));

    const plantillaHandlebars = handlebars.compile(plantilla);

    const datos = {
        nombre: "nombre1",
        nroReclamo: "reclamo1",
        //estado: ""//esto ver a futuro
    };

    const htmlCorreo = plantillaHandlebars(datos);

    const transporter = nodemailer.createTransport(
        {
            service: "gmail",
            auth: {
                user: process.env.DIRECCION_CORREO,
                pass: process.env.CLAVE_CORREO
            }
        }
    );

    const mailOptions = {
        from: "Grupo 17 | Prog3",//"api",//puede no ir, quedaria el correo
        to: correoCliente,
        subject: "Actualización de su reclamo.",
        text: htmlCorreo
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error al enviar el mail:", error);
        } else {
            console.log("Mail enviado: ", info)
        }
    });

    res.send();
});
