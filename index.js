const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const cors = require('cors');
const app = express();

const corsOptions = {
    origin: '*',
  };
  const corsMiddleware = cors(corsOptions);
  
app.use(corsMiddleware);

app.use(express.json());

app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
})
const routes = require('./routes/routes');
app.use('/api', routes);


const mongoString = process.env.DATABASE_URL;

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

