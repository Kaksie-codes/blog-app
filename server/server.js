const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const User = require('./Models/User');
// const User  = require('./models/User')
// import User from './Models/User'
// import User from './Models/User'

const server = express();

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

// This enables us to read the content of the .env file
dotenv.config();

//this middleware helps the backend receive json data from the frontend
server.use(express.json());

const PORT = 3000;
mongoose.connect(process.env.MONGO_URL, {autoIndex:true})
.then((result) => {
    console.log('connected to database');
  
    //listen for requests after connections has been made to the database
    server.listen(PORT, () => {
        console.log(`server started listening on port ${PORT}`);
    })

})
.catch(err => console.log('error', err));


server.post('/signup', (req, res) => {
    const { fullname, email, password } = req.body;

    // validating the data from the frontend
    if(fullname.length < 3){
        return res.status(403).json({"error": "Full name must be at leat three latters long"})
    }
    if(!email.length){
        return res.status(403).json({"error": "enter email"})
    }
    if(!emailRegex.test(email)){
        return res.status(403).json({"error": "Email is Invalid"})
    }
    if(!passwordRegex.test(password)){
        return res.status(403).json({"error": "Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters."})
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    console.log(hashedPassword);
    
    const newUser = new User({
        fullname,
        email,
        password: hashedPassword,
      });
    return res.status(200).json({"status": "Okay"})
})