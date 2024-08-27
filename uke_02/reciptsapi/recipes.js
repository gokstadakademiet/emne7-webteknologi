import { faker } from "@faker-js/faker";

// {
//     id: string // unik identifikator
//     name: string  // navn på retten
//     ingredients: [] // liste med ingredienser
//     instructions: [] // tilberedningsinstruksjoner
//     difficulty: ''  // vanskelighetsgrad på oppskriften
//     prepTime: 45 // tilberedningstid i minutter
// }

export const recipes = [
    {
        id: faker.string.uuid(),
        name: "pizza",
        ingredients: "tomato, cheese, dough",
        instructions: ["put tomato on dough", "put cheese on tomato", "bake"],
        difficulty: "easy",
        prepTime: 30,
    },
    {
        id: faker.string.uuid(),
        name: "pasta",
        ingredients: "pasta, tomato sauce, cheese",
        instructions: [
            "boil pasta",
            "put tomato sauce on pasta",
            "put cheese on tomato sauce",
        ],
        difficulty: "easy",
        prepTime: 20,
    },
    {
        id: faker.string.uuid(),
        name: "cake",
        ingredients: "flour, sugar, eggs",
        instructions: ["mix flour and sugar", "add eggs", "bake"],
        difficulty: "medium",
        prepTime: 60,
    },
    {
        id: faker.string.uuid(),
        name: "soup",
        ingredients: "water, vegetables, salt",
        instructions: ["boil water", "add vegetables", "add salt"],
        difficulty: "easy",
        prepTime: 30,
    },
    {
        id: faker.string.uuid(),
        name: "salad",
        ingredients: "lettuce, tomato, cucumber",
        instructions: ["wash lettuce", "cut tomato and cucumber", "mix"],
        difficulty: "easy",
        prepTime: 15,
    },
    {
        id: faker.string.uuid(),
        name: "burger",
        ingredients: "bread, beef, cheese",
        instructions: ["fry beef", "put beef and cheese in bread"],
        difficulty: "medium",
        prepTime: 30,
    },
    {
        id: faker.string.uuid(),
        name: "sushi",
        ingredients: "rice, fish, seaweed",
        instructions: ["cook rice", "put fish on seaweed", "roll"],
        difficulty: "hard",
        prepTime: 60,
    },
    {
        id: faker.string.uuid(),
        name: "taco",
        ingredients: "tortilla, beef, salsa",
        instructions: ["fry beef", "put beef and salsa in tortilla"],
        difficulty: "medium",
        prepTime: 30,
    },
    {
        id: faker.string.uuid(),
        name: "sandwich",
        ingredients: "bread, ham, cheese",
        instructions: ["put ham and cheese in bread"],
        difficulty: "easy",
        prepTime: 10,
    },
    {
        id: faker.string.uuid(),
        name: "pancake",
        ingredients: "flour, milk, eggs",
        instructions: ["mix flour, milk, and eggs", "fry"],
        difficulty: "easy",
        prepTime: 20,
    },
];
