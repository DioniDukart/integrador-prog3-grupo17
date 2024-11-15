import nodemailer from "nodemailer";
import handlebars from "handlebars";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export default class NotificacionesServicios {

    enviarCorreo = async (datos) => {
        const pathArchivo = fileURLToPath(import.meta.url); //me da la ubicacion "././index.js"
        //const dir = path.dirname(`${pathArchivo}`); //me queda "././"
        const dir = path.dirname("pathArchivo");

        //const plantilla = fs.readFileSync(path.join(dir + "../utilidades/handlebars/plantilla.hbs"), "utf-8");
        const plantilla = fs.readFileSync(path.join(dir + "/utilidades/handlebars/plantilla.hbs"), "utf-8");

        const plantillaHandlebars = handlebars.compile(plantilla);

        //info con la que se rellena la plantilla handlebars
        const datosCorreo = {
            nombre: datos.nombre,
            nroReclamo: datos.reclamo,
            estado: datos.estado
        };

        const htmlCorreo = plantillaHandlebars(datosCorreo);

        const transporter = nodemailer.createTransport({ //se crea el transporter con los datos del emisor, previamente cargados en .env
            service: "gmail",
            auth: {
                user: process.env.DIRECCION_CORREO,
                pass: process.env.CLAVE_CORREO
            }
        });

        const mailOptions = {
            from: "API Grupo 17 | Prog3", //puede no ir, quedaria el correo emisor
            to: datos.correoElectronico,
            subject: "Actualización de su reclamo ID " + datos.reclamo + ".", //OJO CON ESTE NUMERO?
            html: htmlCorreo
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            return { estado: true, mensaje: "Mail de notificacion enviado." };
        } catch (err) {
            return { estado: false, mensaje: "No se pudo enviar el mail de notificacion.", data: info };

        }
        /* 
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error al enviar el mail: ", error);
            } else {
                console.log("Mail enviado: ", info.response);
                res.send(true);
            }
        });
        */

    };

}