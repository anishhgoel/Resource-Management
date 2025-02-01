require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

app.use(express.json()); 
app.use(cors());         
app.use(morgan('dev')); //for logging http requests

const mongoURI = process.env.MONGODB_URI;

try {
  await mongoose.connect(mongoURI);
  console.log('MongoDB connected');
} catch (err) {
  console.error('MongoDB connection error:', err);
}


app.use('/api/auth', require('./routes/auth'))
app.use('api/projects', require('./routes/projects'))

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=> {
    console.log("Server running on port ${PORT}")
});