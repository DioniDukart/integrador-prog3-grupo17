import mysql from 'mysql2/promise';


export const conexion = await mysql.createConnection({
    host: 'localhost',
    user: 'grupo17', 
    database: 'basetfi', 
    password:  '*prog2024*'
});
