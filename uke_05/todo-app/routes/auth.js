import bcrypt from "bcryptjs";
import express from "express";
import db from "../config/db.js";

const router = express.Router();

// Registrer en ny bruker
router.post("/register", async (req, res) => {
    const { username, password } = req.body;

    try {
        // Sjekk om brukeren allerede eksisterer
        const [rows] = await db.query(
            "SELECT * FROM users WHERE username = ?",
            [username]
        );
        if (rows.length > 0) {
            return res
                .status(400)
                .json({ message: "Brukernavn eksisterer allerede" });
        }

        // Hash passordet
        const hashedPassword = await bcrypt.hash(password, 10);

        // Sett inn den nye brukeren i databasen
        await db.query("INSERT INTO users (username, password) VALUES (?, ?)", [
            username,
            hashedPassword,
        ]);

        res.status(201).json({ message: "Bruker registrert vellykket" });
    } catch (error) {
        res.status(500).json({ message: "Serverfeil" });
    }
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        // Finn brukeren ved brukernavn
        const [rows] = await db.query(
            "SELECT * FROM users WHERE username = ?",
            [username]
        );
        if (rows.length === 0) {
            return res
                .status(400)
                .json({ message: "Ugyldig brukernavn eller passord" });
        }

        const user = rows[0];

        // Sammenlign det angitte passordet med det lagrede hashede passordet
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res
                .status(400)
                .json({ message: "Ugyldig brukernavn eller passord" });
        }

        // Generer en enkel token (eller vurder JWT for mer robust autentisering)
        // Her kan du eventuelt sende en token som respons i stedet for å bruke sesjoner
        res.json({ message: "Innlogging vellykket" });
    } catch (error) {
        res.status(500).json({ message: "Serverfeil" });
    }
});

export default router;
