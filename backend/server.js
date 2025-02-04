import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import http from 'http';
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import userRoutes from './routes/users.js';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);

// CORS Configuration
const frontendUrl = process.env.FRONTEND_URL || 'https://resource-management-f979.onrender.com';
const corsOptions = {
  origin: frontendUrl,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(morgan('dev'));

const mongoURI = process.env.MONGODB_URI;

// Socket.IO with matching CORS configuration
const io = new Server(server, {
  cors: {
    origin: frontendUrl,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  },
});

app.locals.io = io;

io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

try {
  await mongoose.connect(mongoURI);
  console.log('MongoDB connected');
} catch (err) {
  console.error('MongoDB connection error:', err);
}

// Testing route
app.get('/', (req, res) => {
  res.send("hello world");
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);

if (process.env.NODE_ENV === 'production') {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5001;

// Use server.listen instead of app.listen for Socket.IO
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});