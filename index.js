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
    //"lo que llegue en el body procesalo como formato json"
    express.json() //esto es como pasar una callback?
);

app.listen(puerto, () => {
    console.log(`Hola puerto ${puerto}!`);
});

app.get("/", (req, res) => {
    res.status(200).send({ estado: true });
});

app.get("/", async (req, res) => {

});

app.get("/", (req, res) => {

});

app.post("/notificacion", (req, res) => {
    const direccionCorreo = req.body.correoElectronico; // "correoElectronico" lit es como viene en la solicitud http

    const pathArchivo = fileURLToPath(import.meta.url); //me da la ubicacion "././index.js"
    const dir = path.dirname(`${pathArchivo}`); //me queda "././"

    const plantilla = fs.readFileSync(path.join(dir + "/utilidades/handlebars/plantilla.hbs"));


    res.send();
});