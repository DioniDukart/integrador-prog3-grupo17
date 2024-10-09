//Uso mysql2/promise para conectarme a MySQL usando promises
import mysql from "mysql2/promise";

import dotenv from "dotenv";
dotenv.config();

//crea la conexion a la bd
//se exporta
export const conexion = await mysql.createConnection({
    host: process.env.HOST_BD,
    user: process.env.USUARIO_BD, //tal cual el usuario de la db?
    password: process.env.CLAVE_BD, //tal cual el usuario en la db?
    database: process.env.NOMBRE_BD //
});

