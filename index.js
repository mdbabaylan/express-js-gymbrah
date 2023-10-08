const express = require('express');
const mongoose = require('mongoose');
const https = require('https');
const fs = require('fs');
require('dotenv').config();

const cors = require('cors');
const app = express();

const corsOptions = {
    origin: '*',
};
const corsMiddleware = cors(corsOptions);

app.use(corsMiddleware);
app.use(express.json());
const passphrase = '1234';

// Read the key and certificate
const privateKey = fs.readFileSync('./key.pem', 'utf8');
const certificate = fs.readFileSync('./cert.pem', 'utf8');


// Create an HTTPS service with the Express app
const credentials = { key: privateKey, cert: certificate, passphrase };
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(8080, () => {
    console.log(`HTTPS Server Started at ${8080}`)
});

const routes = require('./routes/routes');
app.use('/api', routes);



//const mongoString = process.env.DATABASE_URL;
const mongoString = "mongodb+srv://mdbabaylan:1ukfdubstep@clustermark.y48yiog.mongodb.net";

//connect to DB
mongoose.connect(mongoString);
const database = mongoose.connection

//DB vibe check
database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

