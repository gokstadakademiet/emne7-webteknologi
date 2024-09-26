import mysql from "mysql2";

const pool = mysql.createPool({
    host: "localhost",
    user: "bcrypt_demo_user",
    password: "Str0ngP@ssw0rd!",
    database: "bcrypt_demo",
});

export default pool.promise();
