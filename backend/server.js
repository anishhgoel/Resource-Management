import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';

dotenv.config();

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

// Testing route
app.get('/', (req, res)=>{
    res.send("hello world")
})


app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`)
});