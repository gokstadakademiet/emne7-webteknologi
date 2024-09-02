import { faker } from "@faker-js/faker";

// {
//     id: string // unik identifikator
//     name: string  // navn på retten
//     ingredients: [] // liste med ingredienser
//     instructions: [] // tilberedningsinstruksjoner
//     difficulty: ''  // vanskelighetsgrad på oppskriften
//     prepTime: 45 // tilberedningstid i minutter
// }

export const oppskrifter = [
    {
        id: "1",
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
];
