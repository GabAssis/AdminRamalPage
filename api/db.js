import mysql from "mysql";


const baseHost=process.env.API_DB_IP
const baseUser=process.env.API_DB_USER
const basePass=process.env.API_DB_PASS

export const db = mysql.createPool({
    host: baseHost,
    user: baseUser,
    password: basePass,
    database: "db_ramal"
});

db.getConnection((err, connection) => {
    if (err) {
        console.error("Erro ao conectar ao banco de dados:", err);
    } else {
        console.log("Conectado ao banco de dados!");
        connection.release(); // Libera a conexão de volta para o pool
    }
});