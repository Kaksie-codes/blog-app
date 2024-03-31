import bcrypt from 'bcrypt'
import User from '../models/user.model.js'
import VerificationToken from '../models/VerificationToken.model.js';
import ResetOTP from '../models/resetOTP.model.js';
import jwt from 'jsonwebtoken';
import handleError from '../utils/error.js';
import generateToken from '../utils/generateToken.js';
import otpGenerator from 'otp-generator'
import { generateAndSendPasswordResetOTP, sendVerificationEmail } from '../utils/mail.js'
import crypto from 'crypto'



let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password



// @desc Register a new User
// @route POST: /api/auth/signup
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


        if(usernameExists){
            return next(handleError(403, "Username is already in use" ));         
        }
        if(emailExists){
            return next(handleError(403, "Email is already in use"));         
        }       

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
    
        // Create a new User
        const newUser = new User({
            personal_info:{            
                username,
                email, 
                password: hashedPassword            
            }        
        });

        await newUser.save();
             

        const { personal_info: { username:user_username, email:user_email, profile_img}, role, _id} = newUser

        generateToken(res, _id);

        await sendVerificationEmail(newUser);   

        return res.status(200).json({
            status: 'verification pending', 
            message: `verification link sent to your email'`,
            user:{
                username: user_username,                
                profile_img, 
                userId:_id,
                role
            },            
        })         
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
            return next(handleError(400, "User not found" ));            
        }

        //check if the user is not signed in with google
        if(!user.google_auth){
            // comapare new password with encrypted password
            const validated = await bcrypt.compare(password, user.personal_info.password);

            // If passwords dont match
            if(!validated){
                return next(handleError(403, "Wrong Credentials" ));                 
            }else{
                
            }
    
            // generate Access Token 
            generateToken(res, user._id); 

           const { personal_info: { username, fullname, profile_img}, role } = user
            // const expiryTime = new Date(Date.now() + 360000) //1 hour
            return res.status(200).json({
                status: 'Success', 
                message: `user '${username}' with email '${email}' was successfully logged in`,                
                user:{
                    username, 
                    fullname,               
                    profile_img,
                    role
                }                
            })            
        }  
    }catch(error){
        return next(error);
    }
}

// @desc Log a user out
// @route POST /api/auth/signout'
// @access Public
const signoutUser = async (req, res, next) => {
    try {        
        res.clearCookie('jwt').status(200).json({message: 'Signed out successfully'})
    } catch (error) {
        return next(error);
    }   
}


// @desc Generate OTP
// @route GET /api/auth/admin'
// @access Public
const adminRoute = async (req, res, next) => {
    try {       
        res.status(200).json({message: 'Access Granted, because you are an admin', user: req.user})
    } catch (error) {
        return next(error)        
    }
}

// @desc a sample private route
// @route GET /api/auth/private'
// @access Private
const resetPassword = async (req, res, next) => {
    try {  
        const { _id } = req.user;
        const { newPassword } = req.body;
        const user = await User.findById(_id);

        if(!user){
           return next(handleError(403, 'User not found'))
        }

        if(!newPassword){
            return next(handleError(403, 'Provide your new Password'))
        }

        // Update user's password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.personal_info.password = hashedPassword;
        await user.save();

        // Clear JWT cookie
        res.clearCookie('jwt');

        res.status(200).json({ status: 'SUCCESS', message: 'Password reset successfully.' })
    } catch (error) {
        return next(error)        
    }
}


// @desc Generate OTP
// @route POST: /api/auth/generateOTP'
// @access Public
const generateOTP = async (req, res, next) => {
    const { email } = req.body
    try {
        if(!email){
            next(handleError(403, 'Please Provide your email'))
        }
        // Check if User has already registered
        const user = await User.findOne({"personal_info.email": email});

        if(!user){// user does not exist
          return  next(handleError(403, `Account doesn't exist`))
        }else{//user exists
            //generate and send new OTP to users email
            await generateAndSendPasswordResetOTP(user);
        }
        return res.status(200).json({
            status:'SUCCESS',
            status:'Password reset OTP sent to user',
        })        
    } catch (error) {
        return next(error);        
    }
}


// @desc Verify OTP
// @route POST /api/auth/verifyOTP
// @access Public
const verifyOTP = async (req, res, next) => {    
    try {
        let { userId, OTP } = req.body

        // Check if user provided details
        if(!userId || !OTP){
            return next(handleError(403, 'Empty OTP details are not allowed'));
        }

       // Find the user based on the userId
        const user = await User.findById(userId);

        // User doesn't exist
        if(!user){
            return next(handleError(403, `Account record doesn't exist, Please create Account`));
        }

        // If User exists in database, check for the userId in the ResetOTP collections
        const userVerificationRecords = await ResetOTP.findOne({owner:userId});

        if(!userVerificationRecords){
            //no record found
            return next(handleError(403, `This OTP is already verified`));
        }else{
            // user OTP record exists                
            const { expiresAt, OTP:savedOTP } = userVerificationRecords;
            if(expiresAt < Date.now()){
                // User OTP record has expired, delete ResetOTP
                await ResetOTP.deleteMany({owner:userId});
                return next(handleError(403, 'OTP has expired. Please request again.'))
            }else{
                // compare generated OTP to the hashed OTP in th database
                const validOTP = await bcrypt.compare(OTP, savedOTP);
                if(!validOTP){
                    // Supplied OTP is wrong
                    return next(handleError(403, 'Invalid code passed, check your inbox.'))
                }else{
                    // success valid OTP
                    const verifiedUser = await User.findOneAndUpdate({_id: userId}, { verified: true});

                    //  delete the VerificationOTP
                    await ResetOTP.deleteMany({owner:userId});

                    // Upon successful OTP verification, generate and store the JWT token in cookies
                    generateToken(res, userId);
                    const {personal_info: {username, email, profile_img}, role} = verifiedUser;
                    return res.status(200).json({
                        status: 'Success', 
                        message: `user '${username}' with email '${email}' was successfully VERIFIED`,                
                        user:{
                            username,                                           
                            profile_img,
                            role
                        }                
                    })     
                }
            }
        }       
    } catch (error) {
        return next(error);        
    }
}


// @desc Successfully redirecting user when OTP is valid
// @route GET /api/auth/resendOTP
// @access Public
const resendOTP = async (req, res, next) => {
    const { email } = req.body
    try {
        if(!email){
            next(handleError(403, 'Please Provide your email'))
        }
        // Check if User has already registered
        const user = await User.findOne({"personal_info.email": email});
        
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

// @desc Authenticate a User using Google
// @route POST /api/auth/google-auth'
// @access Protected
const verifyUser = async (req, res, next) => {
    try {
        const { _id: userId } = req.user;
        const { token: userToken } = req.query;

        // check if user exists
        const user = await User.findById(userId);

        if(!user){
           return  next(handleError(403, 'User dosent exist'))
        }

        const verificationToken = await VerificationToken.findOne({owner: userId });

        if(!verificationToken){
            return  next(handleError(403, 'User is already verified'))
        }

        // user OTP record exists                
        const { expiresAt, token:savedToken } = verificationToken;

        if(expiresAt < Date.now()){
            return  next(handleError(403, 'verification link expired,  request for another link'))
        }

         // Compare the hashed token with the hash of the user-provided unhashed token
        const isValid = crypto.createHash('sha256').update(userToken).digest('hex') === savedToken;

        if(!isValid){
            return  next(handleError(403, 'Invalid verification token'))
        }

        await User.updateOne({_id: userId}, {verified:true})

        // Delete verification token from the database
        await VerificationToken.deleteOne({ owner: userId  });

        return res.status(200).json({ success: true, message: 'User successfully verified' });
    } catch (error) {
        return next(error);
    }
}

export  {
    signupUser,
    signinUser,
    signoutUser,
    googleAuth,
    generateOTP,
    verifyOTP,   
    resendOTP,
    adminRoute,
    resetPassword,
    verifyUser
}