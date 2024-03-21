const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

const formatDataToSend = (user) => {
    const accessToken = jwt.sign({id: user._id}, process.env.SECRET_ACCESS_KEY);

    return {
        accessToken,
        profile_img: user.personal_info.profile_img,
        username: user.personal_info.username,
        fullname: user.personal_info.fullname
    }
}

const signup = async (req, res) => {
    const { username, email, password } = req.body;
    try{        

    // validating the data from the frontend
    if(username.length < 3){
        return res.status(403).json({"error": "Username must be at leat three latters long"})
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
    
    const newUser = new User({
        personal_info:{            
            username,
            email,
            password: hashedPassword            
        }        
      });

      const user = await newUser.save();
      console.log('new User >>', newUser);
      return res.status(200).json(formatDataToSend(user)) 
    }catch(error){
        if(error.code === 11000){
            return res.status(500).json({"error": "Username already Exists"});            
        }
        res.status(500).json(error);
    }    
}

const signin = async (req, res) => {
    const { email, password } = req.body;

    try{
        const user = await User.findOne({"personal_info.email":email});
        if(!user){
            return res.status(400).json({"error" : "User not found"})
        }
        const validated = await bcrypt.compare(password, user.personal_info.password);
        if(!validated){
            return res.status(403).json('Wrong Credentials')
        }

        //generate Access Token
        const accessToken = jwt.sign({id: user._id}, process.env.SECRET_ACCESS_KEY);
       
        const expiryTime = new Date(Date.now() + 360000) //1 hour
        return res.cookie('access_token', accessToken, { httpOnly: true, expires: expiryTime }).status(200).json(formatDataToSend(user))
       
    }catch(err){
        console.log(err.message);
        return res.status(500).json({"error": err.message});
    }
}

module.exports = {
    signup,
    signin
}