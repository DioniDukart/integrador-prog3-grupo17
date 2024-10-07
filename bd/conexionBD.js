import mysql from "mysql2/promise"

//crea la conexion a la bd
//se exporta
export const conexion= await mysql.createConnection({
    host: "localhost",
    user: "grupo17", //tal cual el usuario de la db?
    database: "reclamos", //tal cual el usuario en la db?
    password: "grupo17", //
});