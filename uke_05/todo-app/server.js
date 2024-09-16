// app.js
import express from "express";
import authRoutes from "./routes/auth.js";

const app = express();

// Middleware
app.use(express.json());

// Bruk autentiseringsrutene
app.use("/auth", authRoutes);

// Start serveren
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveren kjører på port ${PORT}`);
});
