import bcrypt from 'bcrypt'
import User from '../models/user.model.js'
import jwt from 'jsonwebtoken';
import handleError from '../utils/error.js';


let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

// const formatDataToSend = (user) => {
//     const accessToken = jwt.sign({id: user._id}, process.env.SECRET_ACCESS_KEY);

//     return {
//         accessToken,
//         profile_img: user.personal_info.profile_img,
//         username: user.personal_info.username,
//         fullname: user.personal_info.fullname
//     }
// }


// Generate Token
const generateToken = (UserId) => {
    return jwt.sign({id: UserId}, process.env.SECRET_ACCESS_KEY, {
        expiresIn: '30d'
    });
}

// @desc Register a new User
// @route POST /api/auth/signup
// @access Public
const signupUser = async (req, res, next) => {
    const { username, email, password } = req.body;

    try{ 
        // validating the data from the frontend
        if(username.length < 3){
            return next(handleError(403, "Username must be at least three letters long" ));        
        }
        if(!email.length){
            return next(handleError(403, "Enter email" ));
        }
        if(!emailRegex.test(email)){
            return next(handleError(403, "Email is Invalid" ));       
        }
        if(!passwordRegex.test(password)){
            return next(handleError(403, "Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters." ));         
        }

        //check if the user already exists in the database
        const emailExists = await User.findOne({"personal_info.email":email});
        const usernameExists = await User.findOne({"personal_info.username": username});

        if(emailExists){
            return next(handleError(403, "Email is already in use"));         
        }
        if(usernameExists){
            return next(handleError(403, "Username is already in use" ));         
        }

        // Hash the password
        const hashedPassword = bcrypt.hashSync(password, 10);
    
        // Create a new User
        const newUser = new User({
            personal_info:{            
                username,
                email,
                password: hashedPassword            
            }        
        });

        // Save the new User in the database
        await newUser.save();
        const { personal_info: {_id, username:user_username, email:user_email, fullname, profile_img}} = newUser
        const accessToken = generateToken(_id);

        return res.status(200).json({
            status: 'Success', 
            result: `user '${user_username}' with email '${user_email}' was successfully registered`,
            user:{
                username:user_username,                
                profile_img
            },
            accessToken
        }) 
        // return res.status(200).json(formatDataToSend(user)) 
    }catch(error){
        if(error.code === 11000){
            return next(handleError(500, "Username already Exists"));
        }
        return next(error);
    }    
}

// @desc Login a User
// @route POST /api/auth/signup
// @access Public
const signinUser = async (req, res, next) => {
    const { email, password } = req.body;

    try{
        // Check if User has already registered
        const user = await User.findOne({"personal_info.email":email});
        if(!user){
            next(handleError(400, "User not found" ));            
        }

        //check if the user is not signed in with google
        if(!user.google_auth){
            // comapare new password with encrypted password
            const validated = bcrypt.compare(password, user.personal_info.password);

            // If passwords dont match
            if(!validated){
                return next(handleError(403, "Wrong Credentials" ));                 
            }
    
            // generate Access Token            
            const accessToken = generateToken(user._id)
           const { personal_info: { username, fullname, profile_img} } = user
            // const expiryTime = new Date(Date.now() + 360000) //1 hour
            return res.status(200).json({
                status: 'Success', 
                result: `user '${username}' with email '${email}' was successfully logged in`,
                user:{
                    username, 
                    fullname,               
                    profile_img
                },
                accessToken
            })
            // return res.cookie('access_token', accessToken, { httpOnly: true, expires: expiryTime }).status(200).json(formatDataToSend(user))
        }  
    }catch(error){
        return next(error);
    }
}

// @desc Authenticate a User using Google
// @route POST /api/auth/google-auth'
// @access Public
const getMe = async (req, res, next) => {
    try {
        res.status(200).json({message: 'Access Granted', user: req.user})
    } catch (error) {
        return next(error)
        
    }
}

// @desc Authenticate a User using Google
// @route POST /api/auth/google-auth'
// @access Public
const googleAuth = async (req, res, next) => {
    const { email, name, photo } = req.body;
    try {
        // Check if user already exists in the database
        let user = await User.findOne({"personal_info.email": email});

        if (user) {
            // Check if the existing user was not signed up with Google
            if (!user.google_auth) {
                next(handleError(403, "This email was signed up without Google. Please log in with password to access the account"));
            }else{
                //generate Access Token
                const accessToken = jwt.sign({id: user._id}, process.env.SECRET_ACCESS_KEY);
                
                const expiryTime = new Date(Date.now() + 360000) //1 hour

                // Respond with the user information and access token
                return res.cookie('access_token', accessToken, { httpOnly: true, expires: expiryTime }).status(200).json(formatDataToSend(user));
            }            
        } else {
            // If user does not exist, create a new user with Google authentication            
            const username = name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-8);

            user = new User({
                personal_info: { 
                    fullname: name,
                    username,
                    email,
                    profile_img: photo
                },
                google_auth: true
            });

            // Save the new user to the database
            await user.save();

        //generate Access Token
        const accessToken = jwt.sign({id: user._id}, process.env.SECRET_ACCESS_KEY);
        
        const expiryTime = new Date(Date.now() + 360000) //1 hour

        // Respond with the user information
        return res.cookie('access_token', accessToken, { httpOnly: true, expires: expiryTime }).status(200).json(formatDataToSend(user));
        }        
    } catch (error) {
        next(error);        
    }
}


const signoutUser = (req, res) => {
    res.clearCookie('access_token').status(200).json('Signed out successfully')
}

export  {
    signupUser,
    signinUser,
    signoutUser,
    googleAuth,
    getMe,
}