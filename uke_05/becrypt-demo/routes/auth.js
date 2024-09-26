import bcrypt from "bcryptjs";
import { Router } from "express";
import db from "../config/db.js";

const router = Router();

router.post("/register", async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await db.query(
            "SELECT * FROM users WHERE username = ?",
            [username]
        );

        if (rows.length > 0) {
            return res.status(400).send("Username already exists");
        }
        console.log("[Credentials]", username, password);
        // * Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log("[Credentials]", username, password, hashedPassword);
        // * Insert the user into the database with associated hashed password
        await db.query("INSERT INTO users (username, password) VALUES (?, ?)", [
            username,
            hashedPassword,
        ]);

        res.status(201).send("User registered");
    } catch {
        res.status(500).send("Internal Server Error");
    }
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await db.query(
            "SELECT * FROM users WHERE username = ?",
            [username]
        );

        if (rows.length !== 1) {
            return res.status(400).send("Username not found");
        }

        const user = rows[0];
        // ! user.password er hashed password from database
        // ! password er password fra req.body
        // * Compare the hashed password with the password provided
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            res.status(400).send("Login failed");
        }

        res.send("Login successful");
    } catch {
        res.status(500).send("Internal Server Error");
    }
});

export default router;
