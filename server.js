const express = require ('express');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoute = require("./routes/userRoute")

const app = express()

// Middleware
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(bodyParser.json())

//  Routes Middleware
app.use("/api/users", userRoute)

// Routes
app.get("/", (req, res) => {
    res.send("Home Page");
})

const PORT = process.env.PORT || 5000;

// Connect to Db and Start Server
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server Running on ${PORT}`)
        })

    })
    .catch((err) => console.log(err))