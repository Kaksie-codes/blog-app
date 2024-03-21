const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth.route');
// const cors = require('cors')


const server = express();

// This enables us to read the content of the .env file
dotenv.config();

//this middleware helps the backend receive json data from the frontend
server.use(express.json());
// server.use(cors());
 

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

//middleware for handling errors
// server.use((err, req, res, next) => {
//     const statusCode = err.statusCode || 500;
//     const message = err.message || 'Internal Server Error';
//     return res.status(statusCode).json({
//         success:false,
//         message,
//         statusCode
//     })
// })