import express from "express";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import handlebars from "handlebars";

const app = express();
dotenv.config();

puerto
app.listen(puerto, () => {
    console.log(`Hola puerto ${puerto}!`);
})

app.get("/", (req, res) => {
    res.status(200).send({estado:true});
})