
## Del 1: Brukerautentisering

### Mål

Implementere brukerregistrering og innlogging med sikker passordlagring ved bruk av bcrypt.

### Steg 1: Prosjektoppsett

1. **Initialiser prosjektet:**
   - **Opprett prosjektmappe:**
     Lag en ny katalog for prosjektet ditt, for eksempel `todo-app`, og naviger inn i denne katalogen.
   - **Initialiser prosjektet:**
     Kjør `npm init` for å opprette en `package.json`-fil. Følg instruksjonene for å fylle ut prosjektinformasjonen.

     ```bash
     npm init -y
     ```

   - **Installer nødvendige pakker:**
     Bruk `npm install` for å installere nødvendige avhengigheter: `express`, `mysql2`, `bcryptjs`.

     ```bash
     npm install express mysql2 bcryptjs
     ```

   - **Installer nødvendige utvikler pakker:**
     Bruk `npm install --save-dev` for å installere nødvendige utvikler avhengigheter: `nodemon`.

     ```bash
     npm install --save-dev nodemon
     ```

   - **Sett opp ES6-moduler:**
     I `package.json`, legg til `"type": "module"` for å bruke ES6-moduler i stedet for CommonJS.

    ```diff
    package.json

    {
        "name": "todo-app",
        "version": "1.0.0",
        "main": "app.js",
    +   "type": "module",
        "scripts": {
    +       "start": "nodemon server.js"
    -       "test": "echo \"Error: no test specified\" && exit 1"
        },
    +   "dependencies": {
    +       "express": "^4.17.1",
    +       "mysql2": "^3.0.0",
    +       "bcryptjs": "^2.4.3"
    +   },
    +   "devDependencies": {
    +       "nodemon": "^3.1.4"
    +   }
    }
    ```

2. **Katalogstruktur:**
   - **Lag mappestruktur:**
     Opprett katalogene `config` og `routes` i prosjektmappen. Dette vil holde konfigurasjonsfiler og ruter separat. Opprett filene `server.js`, script.sql, `db.js` i `config` mappen og `auth.js` i `routes` mappen

        ```diff
        todo-app/
            ├── node_modules/
        +   ├── config/
        +   │   └── db.js
            │
        +   ├── routes/
        +   │   └── auth.js
            │
        +   ├── server.js
            ├── package.json
            └── README.md
        ```

### Steg 2: Databaseoppsett

1. **Opprett MySQL Database og Brukertabell:**
   - **Lag en database:**
     Koble til MySQL via MySql Workbench og opprett en database kalt `todo_app`.

     ```sql
     CREATE DATABASE todo_app;
     ```

   - **Opprett en tabell for brukere:**
     Lag en tabell som heter `users` med kolonner for bruker-ID, brukernavn og passord. Kolonnen `id` er en auto-inkrementerende primærnøkkel, `username` må være unik, og `password` lagrer det hashede passordet.

     ```sql
     USE todo_app;

     CREATE TABLE users (
         id INT AUTO_INCREMENT PRIMARY KEY,
         username VARCHAR(255) NOT NULL UNIQUE,
         password VARCHAR(255) NOT NULL
     );
     ```

2. **Databaseforbindelse:**
   - **Konfigurer databaseforbindelsen:**
    Opprett en fil `db.js` i `config`-katalogen for å konfigurere tilkoblingen til MySQL-databasen ved hjelp av `mysql2`-modulen.

    <details>
    <summary>
    <b><i>Tilkoblingspool vs. Enkel Tilkobling (Les mer)</b></i>
    </summary>

    <br>

    **Tilkoblinspool (pool)**

    En tilkoblingspool administrerer flere tilkoblinger til databasen. Her er noen grunner til å bruke en tilkoblingspool:

    1. Effektiv Håndtering av Flere Forespørseler:

        - En tilkoblingspool gjør det mulig å gjenbruke eksisterende tilkoblinger, noe som reduserer behovet for å opprette en ny tilkobling for hver forespørsel. Dette sparer tid og ressurser.
        - Hvis en tilkobling allerede er ledig i poolen, kan den brukes til en ny forespørsel umiddelbart, i stedet for å vente på at en ny tilkobling blir opprettet.
    2. Reduserer Belastningen på Databasen:

        - Oppretting av en ny tilkobling til databasen kan være ressurskrevende. Ved å bruke en tilkoblingspool kan du begrense antallet samtidige tilkoblinger og unngå å overbelaste databasen med unødvendige tilkoblingsforespørseler.
    3. Forbedrer Ytelsen:

        - Tilkoblingspooler kan forbedre ytelsen av applikasjonen ved å redusere overheaden knyttet til å opprette og lukke tilkoblinger kontinuerlig.

    4. Automatisk Tilkoblingshåndtering:

        - Poolen håndterer automatisk tilkoblingsopprettelse, vedlikehold og lukking, noe som forenkler kodeadministrasjonen og reduserer muligheten for feil.

    **Enkel Tilkobling (connect)**

    En enkel tilkobling opprettes hver gang du trenger å kommunisere med databasen, og lukkes etter at forespørselen er fullført. Dette kan være tilstrekkelig for enkle applikasjoner eller utviklingsformål, men har noen ulemper:

    1. Høy Overhead:

        - Hver tilkobling må opprettes og lukkes for hver databaseoperasjon, noe som kan føre til høy overhead og redusert ytelse, spesielt under høy belastning.

    2. Begrenset Samtidighet:

        - Hvis mange forespørseler gjøres samtidig, kan det bli et flaskehalsproblem med tilkoblinger som må opprettes og lukkes kontinuerlig.

    3. Potensielle Ressursproblemer:

        - Unødvendig oppretting og lukking av tilkoblinger kan føre til ressursproblemer og redusert effektivitet på serveren.
    </details>

    <br>

    ```js
    // config/db.js
    import mysql from 'mysql2';

    const pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: 'your_password',
        database: 'todo_app'
    });

    export default pool.promise();
    ```

    Erstatt `'your_password'` med passordet ditt for MySQL.

### Steg 3: Brukerregistrering og Innlogging

1. **Registreringsrute:**
   - **Lag rute for brukerregistrering:**
     Opprett en fil `auth.js` i `routes`-katalogen for å håndtere registrerings- og innloggingsruter.

   **Forklaring:**
   - **Håndtering av POST-forespørsel:** Når en bruker sender en POST-forespørsel til `/register`, serveren mottar data i form av JSON med `username` og `password`.
   - **Sjekk om brukeren allerede eksisterer:** Før du oppretter en ny bruker, sjekk om brukernavnet allerede finnes i databasen. Hvis brukernavnet er tatt, send en 400-statuskode med en feilmelding.
   - **Hash passordet:** Bruk `bcrypt.hash` for å lage en sikker hash av passordet, som sikrer at passordet lagres sikkert i databasen.
   - **Sett inn den nye brukeren:** Hvis brukernavnet er unikt, sett inn det hashede passordet sammen med brukernavnet i databasen.
   - **Send vellykket respons:** Hvis alt går bra, send en 201-statuskode med en bekreftelsesmelding.
   - **Feilhåndtering:** Hvis det oppstår en feil under prosessen, send en 500-statuskode med en feilmelding.

     ```js
     // routes/auth.js
     import express from 'express';
     import bcrypt from 'bcryptjs';
     import db from '../config/db.js';

     const router = express.Router();

     // Registrer en ny bruker
     router.post('/register', async (req, res) => {
         const { username, password } = req.body;

         try {
             // Sjekk om brukeren allerede eksisterer
             const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
             if (rows.length > 0) {
                 return res.status(400).json({ message: 'Brukernavn eksisterer allerede' });
             }

             // Hash passordet
             const hashedPassword = await bcrypt.hash(password, 10);

             // Sett inn den nye brukeren i databasen
             await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);

             res.status(201).json({ message: 'Bruker registrert vellykket' });
         } catch (error) {
             res.status(500).json({ message: 'Serverfeil' });
         }
     });

     export default router;
     ```

2. **Innloggingsrute:**
   - **Lag rute for innlogging:**
     Fortsett å bruke `auth.js` for å legge til innloggingsruten.

   **Forklaring:**
   - **Håndtering av POST-forespørsel:** Når en bruker sender en POST-forespørsel til `/login`, serveren mottar data i form av JSON med `username` og `password`.
   - **Finn brukeren i databasen:** Utfør en SQL-spørring for å hente brukeren med det angitte brukernavnet. Hvis brukeren ikke finnes, send en 400-statuskode med en feilmelding.
   - **Sammenlign passordet:** Bruk `bcrypt.compare` for å sammenligne det angitte passordet med det hashede passordet i databasen. Hvis passordene ikke stemmer overens, send en 400-statuskode med en feilmelding.
   - **Send vellykket respons:** Hvis passordet er korrekt, returner en vellykket respons. Her kan du også vurdere å generere og returnere en token for autentisering, men i denne enkle versjonen sender vi bare en bekreftelsesmelding.
   - **Feilhåndtering:** Hvis det oppstår en feil under prosessen, send en 500-statuskode med en feilmelding.

     ```js
     // routes/auth.js
     // Innloggingsrute
     router.post('/login', async (req, res) => {
         const { username, password } = req.body;

         try {
             // Finn brukeren ved brukernavn
             const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
             if (rows.length === 0) {
                 return res.status(400).json({ message: 'Ugyldig brukernavn eller passord' });
             }

             const user = rows[0];

             // Sammenlign det angitte passordet med det lagrede hashede passordet
             const isMatch = await bcrypt.compare(password, user.password);
             if (!isMatch) {
                 return res.status(400).json({ message: 'Ugyldig brukernavn eller passord' });
             }

             // Generer en enkel token (eller vurder JWT for mer robust autentisering)
             // Her kan du eventuelt sende en token som respons i stedet for å bruke sesjoner
             res.json({ message: 'Innlogging vellykket' });
         } catch (error) {
             res.status(500).json({ message: 'Serverfeil' });
         }
     });
     ```

### Steg 4: Integrering av Autentiseringsruter

1. **Hovedapplikasjonsfil (`app.js`):**
    - **Sett opp Express-serveren og inkluder autentiseringsrutene:**
        Bruk `express.json()` for å håndtere JSON-data fra forespørslene.

        <br>

        **Forklaring:**
    - **Konfigurer middleware:** Bruk `express.json()` for å analysere JSON-data sendt i forespørslene.
    - **Registrer ruter:** Bruk `app.use()` for å inkludere autentiserings rutene definert i `auth.js`.

    - **Start serveren:** Konfigurer serveren til å lytte på en spesifisert port, her 3000.

     ```js
     // app.js
     import express from 'express';
     import authRoutes from './routes/auth.js';

     const app = express();

     // Middleware
     app.use(express.json());

     // Bruk autentiseringsrutene
     app.use('/auth', authRoutes);

     // Start serveren
     const PORT = 3000;
     app.listen(PORT, () => {
         console.log(`Serveren kjører på port ${PORT}`);
     });
     ```
