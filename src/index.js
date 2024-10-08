import express from "express";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import handlebars from "handlebars";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { conexion } from "./bd/conexionBD.js";

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

//crea estado de reclamo
app.post("/reclamos-estados/", async (req, res) => {
    try {
        const { descripcion, activo } = req.body;

        /*
        if (!descripcion) {
            return res.status(404).json({
                mensaje: "Falta el campo descripcion."
            })
        }
        //if (!activo) { //no es adecuado, si se pasara "0" se evaluaria como verdadero (falsy negado)
        if (activo===undefined || activo===null) {
            return res.status(404).json({
                mensaje: "Falta el campo activo."
            })
        }
        */


        //if (!descripcion || !activo) {
        if (!descripcion || activo === undefined || activo === null) {
            return res.status(400).json({
                mensaje: "Falta/n campo/s."
            })
        }

        const consultaSql = 'INSERT INTO reclamos_estado (descripcion, activo) VALUES (?,?)';
        const [resultado] = await conexion.query(consultaSql, [descripcion, activo]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "No se pudo crear."
            });
        }
        //puedo usar resultado.insertId para ya traerme/verificar/mostrar la entrada creada

        //res.status(200).json(resultado);
        res.status(200).json({
            mensaje: "Estado de Reclamo creado."
        });

    } catch (err) {
        res.status(500).json({
            mensaje: "Error"
        });
    };
});

//consulta todo
app.get("/reclamos-estados", async (req, res) => {
    try {
        const consultaSql = "SELECT * FROM reclamos_estado WHERE activo=1;";

        //con los corchetes "desestructuro" la informacion, quedandome asi los datos sin la metadata de la consulta hecha
        const [resultado] = await conexion.query(consultaSql);

        //res.status(200).send({'estado':true});//alternativa?
        //res.status(200).json({ estado: true, data: resultado});
        res.status(200).json(resultado);
    } catch (err) {
        //console.log(err);//no es buena practica, da informacion de mas al usuario
        res.status(500).json({
            mensaje: "Error"
        });
    }
});

//consulta un unico segun su id
app.get("//reclamos-estados/:idReclamoEstado", async (req, res) => {
    try {
        const id = req.params.idEstadoReclamo;

        //EVITAR " $() ", vulnerable a injectsql
        //const consultaSql = `SELECT * FROM reclamos_estado WHERE activo=1 AND idReclamosEstado=${id}`;
        const consultaSql = "SELECT * FROM reclamos_estado WHERE activo=1 AND idReclamoEstado=?";
        const [resultado] = await conexion.query(consultaSql, [id]);//podria pasar varios valores con un [array] en vez de id

        if (resultado.length === 0) {
            res.status(500).json({
                mensaje: "No se encontro resultado/s."
            });
        } else {
            res.status(200).json(resultado);
        }

    } catch (err) {
        //console.log(err);//no es buena practica, da informacion de mas al usuario
        res.status(500).json({
            mensaje: "Error"
        });
    }
});

//patch porque modifica algunos campos de una tabla
app.patch("//reclamos-estados/:idReclamoEstado", async (req, res) => {
    try {
        const { descripcion, activo } = req.body;

        /*
        if (!descripcion) {
            return res.status(404).json({
                mensaje: "Falta el campo descripcion."
            })
        }
        //if (!activo) { //no es adecuado, si se pasara "0" se evaluaria como verdadero (falsy negado)
        if (activo===undefined || activo===null) {
            return res.status(404).json({
                mensaje: "Falta el campo activo."
            })
        }
        */


        //if (!descripcion || !activo) {
        if (!descripcion || activo === undefined || activo === null) {
            return res.status(404).json({
                mensaje: "Falta/n campo/s."
            })
        }

        const idActualizar = req.params.idEstadoReclamo;
        // const datos = {
        //     descripcion,
        //     activo
        // }
        //
        // const consultaSql = 'UPDATE reclamos_estado SET ? WHERE idReclamosEstado=?';
        // const resultado= await conexion.query(consultaSql, [datos, idActualizar]);


        const consultaSql = 'UPDATE reclamos_estado SET descripcion=?, activo=? WHERE idReclamoEstado=?';
        const [resultado] = await conexion.query(consultaSql, [descripcion, activo, idActualizar]); //como hace una modificacion, me trae metadata sobre los cambios de columnas, etc

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "No se pudo modificar."
            });
        }

        //res.status(200).json(resultado);
        res.status(200).json({
            mensaje: "Estado de Reclamo modificado."
        });

    } catch (err) {
        res.status(500).json({
            mensaje: "Error"
        });
    };
});

//import {router as v1Router} from "./v1/rutas/reclamosRutas.js";
//app.use("/api/v1/rutas", v1Router);

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