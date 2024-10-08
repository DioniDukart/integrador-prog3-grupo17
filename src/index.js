import express from "express";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import handlebars from "handlebars";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { conexion } from "./database/conexionBD.js";

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
app.post("/estados-reclamos/", async (req, res) => {
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
app.get("/estados-reclamos", async (req, res) => {
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
app.get("/estados-reclamos/:idEstadoReclamo", async (req, res) => {
    try {
        const id = req.params.idEstadoReclamo;

        //EVITAR " $() ", vulnerable a injectsql
        //const consultaSql = `SELECT * FROM reclamos_estado WHERE activo=1 AND idReclamosEstado=${id}`;
        const consultaSql = "SELECT * FROM reclamos_estado WHERE activo=1 AND idReclamosEstado=?";
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
app.patch("/estados-reclamos/:idEstadoReclamo", async (req, res) => {
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

        const idActualizar = req.params.idEstadoReclamo;
        // const datos = {
        //     descripcion,
        //     activo
        // }
        //
        // const consultaSql = 'UPDATE reclamos_estado SET ? WHERE idReclamosEstado=?';
        // const resultado= await conexion.query(consultaSql, [datos, idActualizar]);


        const consultaSql = 'UPDATE reclamos_estado SET descripcion=?, activo=? WHERE idReclamosEstado=?';
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



//crea estado de reclamo
app.post("/reclamos/", async (req, res) => {
    try {
        //luego crear un objeto para luego tirarselo a la bd?
        const { asunto, descripcion/*, idReclamoEstado*/, idReclamoTipo, idUsuarioCreador/*, idUsuarioFinalizador*/ } = req.body;

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


        //ver cuales son los requeridos
        if (!asunto || !descripcion || !idReclamoTipo || !idUsuarioCreador) {
            return res.status(400).json({
                mensaje: "Falta/n campo/s."
            })
        }
        const reclamo = { //VER COMO HACER "fechaCreado"
            asunto: asunto,
            descripcion: descripcion,
            idReclamoTipo: idReclamoTipo,
            idUsuarioCreador: idUsuarioCreador
        }
        const consultaSql = 'INSERT INTO reclamos SET ?';
        const [resultado] = await conexion.query(consultaSql, reclamo);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "No se pudo crear."
            });
        }
        //puedo usar resultado.insertId para ya traerme/verificar/mostrar la entrada creada

        //res.status(200).json(resultado);
        res.status(200).json({
            mensaje: "Reclamo creado." /*post(resultado.insertId) O ,dato:resultado*/
        });

    } catch (err) {
        res.status(500).json({
            mensaje: "Error"
        });
    };
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
                user: process.env.DIRECCIONCORREO,
                pass: process.env.CLAVECORREO
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