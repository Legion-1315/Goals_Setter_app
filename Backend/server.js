const express = require('express');
const dotenv = require('dotenv').config();
const port = process.env.PORT || 5000;
const colors = require('colors');
const connectDB = require('./config/db');
//Or 5000 is added so as if the previous port is bussy for some reason than this port will work.

//it will output in the console the mongoDB connection string we gave in the .env
connectDB();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/goals', require('./routes/goalRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

app.listen(port, () =>
{
    console.log(`Server just started on port number ${port}`);
})