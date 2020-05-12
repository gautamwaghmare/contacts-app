const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const contactsRoutes = require('./routes/contacts');
const userRoutes = require('./routes/user');

const app = express();

mongoose.connect("mongodb+srv://gautam:" + process.env.MONGO_ATLAS_PW + "@cluster0-c3a6e.mongodb.net/contact-app?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
 .then(() => {
     console.log('Connected to database!');
 })
 .catch((err) => {
     console.log('Connection to database failed!', err);
 });
//1pzmWYHJqHKlUCT5
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    next();
});

app.use('/api/contacts', contactsRoutes);
app.use('/api/user', userRoutes);

module.exports = app;