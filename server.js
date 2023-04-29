const express = require ('express');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express()

const PORT = process.env.PORT || 5000;

// Connect to Db and Start Server
mongoose
    .connect(procee.env.MONGO_URI)
    .then(() => {
        app.listen(PORT, ()=> {
            console.log(`Server Running on ${PORT}`)
        })

    })
    .catch((err) => console.log(err))