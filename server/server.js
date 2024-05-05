import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.route.js'
import blogPostRoutes from './routes/blogPost.route.js'
import userRoutes from './routes/user.route.js'
import commentRoutes from './routes/comment.route.js'
import notificationRoutes from './routes/notification.route.js'
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser'
import { errorHandler } from './middleware/error.middleware.js'
import path from 'path'

const server = express();

const __dirname = path.resolve();

// This enables us to read the content of the .env file
dotenv.config();

//this middleware helps the backend receive json data from the frontend
server.use(express.json());
server.use(express.urlencoded({extended: true}));

// Use cookie-parser middleware to parse cookies
server.use(cookieParser());

// Set payload size limit
server.use(bodyParser.json({ limit: '10mb' }))

const PORT = 3000;
mongoose.connect(process.env.MONGO_URL, {autoIndex:true})
.then(() => {
    console.log('connected to database');
  
    //listen for requests after connections has been made to the database
    server.listen(PORT, () => {
        console.log(`server started listening on port ${PORT}`);
    })
})
.catch(err => console.log('error', err));

server.use('/api/auth', authRoutes);
server.use('/api/post', blogPostRoutes); 
server.use('/api/users', userRoutes);
server.use('/api/comment', commentRoutes);
server.use('/api/notification', notificationRoutes);

server.use(express.static(path.join(__dirname, '/frontend/dist')));

server.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'))
})

// Error handling middleware
server.use(errorHandler);