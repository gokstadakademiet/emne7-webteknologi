// config/db.js
import mysql from "mysql2";

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "todo",
});

export default pool.promise();
