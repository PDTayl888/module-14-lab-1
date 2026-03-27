require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes')

const app = express();
const PORT = process.env.PORT || 3030;

app.use(express.json());

app.use('api/users', userRoutes);

async function connectDB() {
    try {
       await mongoose.connect(process.env.MONGO_URI)
       console.log('MongoDB Connected!')
    } catch(err) {
        console.log(err)
    }
}

connectDB()