import express from "express";
import db from "./config/db.js";
import authRoutes from "./routes/auth.js";
const app = express();

app.use(express.json());
app.use("/auth", authRoutes);

app.get("/users", async (req, res) => {
    const [rows] = await db.query("SELECT * FROM users");
    console.log(rows);
    res.json(rows);
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
