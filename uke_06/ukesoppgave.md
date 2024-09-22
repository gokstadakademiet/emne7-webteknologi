# Bygg en Todo-app med autentisering

**Mål:**

- Bygg en backend-server med Express.js som håndterer Todo-oppgaver.
- Bruk MySQL til å lagre brukere og Todo-oppgaver.
- Implementer registrering og innlogging med hashed passord ved hjelp av bcrypt.
- Bruk JSON Web Tokens (JWT) for autentisering, lagret i cookies.
- Legg til muligheten for å logge ut og beskytte sensitive ruter med autentisering.

## Trinn 1: Opprett prosjekt og installer avhengigheter

1. Initialiser prosjektet:

   ```bash
   mkdir todo-app
   cd todo-app
   npm init -y
   ```

2. Installer nødvendige pakker:

   ```bash
   npm install express mysql2 bcryptjs jsonwebtoken cookie-parser dotenv
   npm install --save-dev nodemon
   ```

3. I `package.json`, legg til `"type": "module"` for å aktivere ES6-moduler:

   ```json
   {
     "name": "todo-app",
     "version": "1.0.0",
     "main": "app.js",
     "type": "module",
     "scripts": {
       "dev": "nodemon app.js"
     },
     "dependencies": {
       "express": "^4.18.1",
       "mysql2": "^2.3.3",
       "bcryptjs": "^2.4.3",
       "jsonwebtoken": "^8.5.1",
       "cookie-parser": "^1.4.6",
       "dotenv": "^16.0.3"
     },
     "devDependencies": {
       "nodemon": "^2.0.19"
     }
   }
   ```

## Trinn 2: Sett opp MySQL-database

1. Opprett en MySQL-database:

   ```sql
   CREATE DATABASE todo_app;
   USE todo_app;
   ```

2. Opprett tabeller for brukere og Todo-oppgaver:

   ```sql
   CREATE TABLE users (
     id INT AUTO_INCREMENT PRIMARY KEY,
     username VARCHAR(255) NOT NULL UNIQUE,
     password VARCHAR(255) NOT NULL
   );

   CREATE TABLE todos (
     id INT AUTO_INCREMENT PRIMARY KEY,
     user_id INT,
     task VARCHAR(255) NOT NULL,
     completed BOOLEAN DEFAULT false,
     FOREIGN KEY (user_id) REFERENCES users(id)
   );
   ```

## Trinn 3: Konfigurer databaseforbindelse

1. Opprett filen `db.js` for å håndtere MySQL-forbindelsen:

   ```js
   import mysql from 'mysql2';
   import dotenv from 'dotenv';

   dotenv.config();

   const connection = mysql.createConnection({
     host: 'localhost',
     user: process.env.DB_USER,  // Angi brukernavn i .env-filen
     password: process.env.DB_PASSWORD,  // Angi passord i .env-filen
     database: 'todo_app'
   });

   connection.connect((err) => {
     if (err) throw err;
     console.log('Connected to MySQL');
   });

   export default connection;
   ```

2. Opprett en `.env`-fil for miljøvariabler:

   ```env
   DB_USER=root
   DB_PASSWORD=yourpassword
   JWT_SECRET=your_jwt_secret
   ```

## Trinn 4: Sett opp Express-server

1. Opprett `app.js` som hovedfil for å kjøre serveren:

   ```js
   import express from 'express';
   import cookieParser from 'cookie-parser';
   import authRoutes from './routes/auth.js';
   import todoRoutes from './routes/todos.js';

   const app = express();

   app.use(express.json());
   app.use(cookieParser());  // For å håndtere cookies

   // Ruter for autentisering og Todo-oppgaver
   app.use('/auth', authRoutes);
   app.use('/todos', todoRoutes);

   // Start serveren
   app.listen(3000, () => {
     console.log('Server is running on port 3000');
   });
   ```

## Trinn 5: Lag autentiseringsruter

1. Opprett en fil `routes/auth.js` for å håndtere registrering, innlogging og utlogging:

   ```js
   import { Router } from 'express';
   import bcrypt from 'bcryptjs';
   import jwt from 'jsonwebtoken';
   import db from '../db.js';
   import dotenv from 'dotenv';

   dotenv.config();

   const router = Router();

   // Registreringsrute
   router.post('/register', async (req, res) => {
     const { username, password } = req.body;

     if (!username || !password) {
       return res.status(400).send('Username and password are required');
     }

     const hashedPassword = await bcrypt.hash(password, 10);

     db.query('INSERT INTO users (username, password) VALUES (?, ?)', 
     [username, hashedPassword], (err, result) => {
       if (err) {
         return res.status(500).send('Error registering user');
       }
       res.status(201).send('User registered');
     });
   });

   // Innloggingsrute
   router.post('/login', (req, res) => {
     const { username, password } = req.body;

     db.query('SELECT * FROM users WHERE username = ?', [username], async (err, users) => {
       if (err || users.length === 0) {
         return res.status(400).send('Invalid credentials');
       }

       const user = users[0];
       const isMatch = await bcrypt.compare(password, user.password);

       if (!isMatch) {
         return res.status(400).send('Invalid credentials');
       }

       const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
       res.cookie('token', token, { httpOnly: true });
       res.send('Logged in');
     });
   });

   // Utloggingsrute
   router.post('/logout', (req, res) => {
     res.clearCookie('token');
     res.send('Logged out successfully');
   });

   export default router;
   ```

## Trinn 6: Lag middleware for autentisering

1. Opprett `authMiddleware.js` for å beskytte ruter med autentisering:

   ```js
   import jwt from 'jsonwebtoken';
   import dotenv from 'dotenv';

   dotenv.config();

   const authMiddleware = (req, res, next) => {
     const token = req.cookies.token;

     if (!token) {
       return res.status(401).send('Access Denied');
     }

     try {
       const verified = jwt.verify(token, process.env.JWT_SECRET);
       req.user = verified;
       next();
     } catch (err) {
       res.status(400).send('Invalid Token');
     }
   };

   export default authMiddleware;
   ```

## Trinn 7: Lag Todo-ruter

1. Opprett en fil `routes/todos.js` for å håndtere Todo-operasjoner:

   ```js
   import { Router } from 'express';
   import db from '../db.js';
   import authMiddleware from '../authMiddleware.js';

   const router = Router();

   // Hent Todos for innlogget bruker
   router.get('/', authMiddleware, (req, res) => {
     db.query('SELECT * FROM todos WHERE user_id = ?', [req.user.id], (err, todos) => {
       if (err) return res.status(500).send('Error fetching todos');
       res.json(todos);
     });
   });

   // Legg til ny Todo
   router.post('/', authMiddleware, (req, res) => {
     const { task } = req.body;

     db.query('INSERT INTO todos (user_id, task) VALUES (?, ?)', 
     [req.user.id, task], (err, result) => {
       if (err) return res.status(500).send('Error adding todo');
       res.status(201).send('Todo added');
     });
   });

   export default router;
   ```

## Trinn 8: Test appen

1. **Registrer en bruker** ved å sende en `POST`-forespørsel til `/auth/register` med brukernavn og passord i JSON-format.
2. **Logg inn** ved å sende en `POST`-forespørsel til `/auth/login`, og motta en JWT-token i cookies.
3. **Legg til og hent Todo-oppgaver** ved å bruke de beskyttede `/todos`-rutene.
4. **Logg ut** ved å sende en `POST`-forespørsel til `/auth/logout`.
