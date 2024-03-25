import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.route.js'
import blogPostRoutes from './routes/blogPost.route.js'
import userRoutes from './routes/user.route.js'
import cookieParser from 'cookie-parser';

const server = express();

// This enables us to read the content of the .env file
dotenv.config();

//this middleware helps the backend receive json data from the frontend
server.use(express.json());

// Use cookie-parser middleware to parse cookies
server.use(cookieParser());

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


// Error handling middleware
server.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
      success: false,
      statusCode,
      message,
    });
});