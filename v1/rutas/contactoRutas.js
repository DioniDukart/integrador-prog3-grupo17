import express from "express";
import ContactoControlador from "../../controladores/contactoControlador.js";

const router = express.Router();

const oficinasControlador = new OficinasControlador();

//estas completan la url del app.use en index
//router.post("/notificacion", oficinasControlador.enviarCorreo);

export { router };