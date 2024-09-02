import { faker } from "@faker-js/faker";
import express from "express";
import { oppskrifter } from "./oppskrifter.js";

const port = 3000;
const app = express();

// middleware for å kunne parse JSON
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Velkommen til oppskrifts-API!");
});

app.get("/pokemon", (req, res) => {
    fetch("https://pokeapi.co/api/v2/pokemon")
        .then((response) => response.json())
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Noe gikk galt");
        });
    // send tilbake oppskrifter
});

app.post("/oppskrifter", (req, res) => {
    const ny_oppskrift_fra_bruker = req.body;

    const ny_id = faker.string.uuid();

    const ny_oppskrift = {
        id: ny_id,
        ...ny_oppskrift_fra_bruker,
    };

    oppskrifter.push(ny_oppskrift);

    res.send(201, ny_oppskrift);
});

app.get("/oppskrifter/:id", (req, res) => {
    const id = req.params.id;

    const oppskrift = oppskrifter.find((oppskrift) => oppskrift.id === id);

    if (oppskrift) {
        res.json(oppskrift);
    } else {
        res.status(404).send({ error: "Fant ikke oppskrift" });
    }
});

app.delete("/oppskrifter/:id", (req, res) => {
    const requested_id = req.params.id;

    // find the index of the recipe with the requested id
    const index = oppskrifter.findIndex((r) => r.id === req.params.id);

    if (index !== -1) {
        // if the recipe is found, remove it from the list of recipes
        oppskrifter.splice(index, 1);
        res.status(204).send({
            message: `Recipe with id ${requested_id} deleted`,
        });
    } else {
        // if the recipe is not found, return an error response
        res.status(404).json({
            error: `Recipe not found for id: ${requested_id}`,
        });
    }
});

app.listen(port, () => {
    console.log(`Serveren kjører på http://localhost:${port}`);
});
