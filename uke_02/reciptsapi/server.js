import { faker } from "@faker-js/faker";
import express from "express";
import { recipes } from "./recipes.js";
const app = express();
const port = 3000;
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Welcome to the cooking recipe api");
});

app.get("/recipes", (req, res) => {
    res.json(recipes);
});

app.post("/recipes", (req, res) => {
    if (!req.body) {
        return res.status(400).json({ error: "Inputdata missing" });
    }

    if (!req.body.name) {
        return res.status(400).json({ error: "Name is missing" });
    }

    const new_id = faker.string.uuid();
    const rest_of_recipe_information = req.body;

    // note the three dots before rest_of_recipe_information - it is called a spread-operator in javascript
    // https://www.w3schools.com/howto/howto_js_spread_operator.asp
    const recipe = { id: new_id, ...rest_of_recipe_information };

    // add the new recipe to the list of recipes
    recipes.push(recipe);

    // Optional - Log id and name of all recipes to console
    console.log(
        "Recipe added: ",
        recipes.map((r) => ({ id: r.id, name: r.name }))
    );

    // return the new recipe as a response
    res.status(201).json(recipe);
});

app.get("/recipes/:id", (req, res) => {
    // we are now using the id from the urls :id parameter instead of the body of the request
    const requested_id = req.params.id;

    // find the recipe with the requested id
    const recipe = recipes.find((r) => r.id === requested_id);

    if (recipe) {
        // if the recipe is found, return it as a response
        res.json(recipe);
    } else {
        // if the recipe is not found, return an error response
        res.status(404).json({
            error: `Recipe not found for id: ${requested_id}`,
        });
    }
});

app.put("/recipes/:id", (req, res) => {
    const requested_id = req.params.id;

    // find the index of the recipe with the requested id
    const index = recipes.findIndex((r) => r.id === requested_id);

    if (index !== -1) {
        // if the recipe is found, update it with the new data from the request
        recipes[index] = { ...recipes[index], ...req.body };

        // return the updated recipe as a response
        res.json(recipes[index]);
    } else {
        // if the recipe is not found, return an error response
        res.status(404).json({
            error: `Recipe not found for id: ${requested_id}`,
        });
    }
});

app.delete("/recipes/:id", (req, res) => {
    const requested_id = req.params.id;

    // find the index of the recipe with the requested id
    const index = recipes.findIndex((r) => r.id === req.params.id);

    if (index !== -1) {
        // if the recipe is found, remove it from the list of recipes
        recipes.splice(index, 1);
        res.status(204).send();
    } else {
        // if the recipe is not found, return an error response
        res.status(404).json({
            error: `Recipe not found for id: ${requested_id}`,
        });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
