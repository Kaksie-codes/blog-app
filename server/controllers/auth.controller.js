import bcrypt from 'bcrypt'
import User from '../models/user.model.js'
import VerificationToken from '../models/VerificationToken.model.js';
import ResetOTP from '../models/resetOTP.model.js';
import jwt from 'jsonwebtoken';
import handleError from '../utils/error.js';
import generateToken from '../utils/generateToken.js';
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
                fullname: '', 
                password: hashedPassword            
            } ,
            verified: true       
        });

        // save the user
        await newUser.save(); 
        
        // send verification link to the user
        await sendVerificationEmail(newUser);   

        return res.status(200).json({
            success: true,
            status: 'verification pending', 
            statusCode:200,
            // message: `verification link sent to your email'`,                     
            message: `Account created Successfully'`,                     
        })         
    }catch(error){
        if(error.code === 11000){
            return next(handleError(500, "Username already Exists"));
        }
        return next(error);
    }    
}

// @desc Login a User
// @route GET /api/auth/resendVerificationMail/:id
// @access Public
const resendVerificationEmail = async (req, res, next) => {
try {
    const { id: userId } = req.params; 

    // check if user exists
    const user = await User.findById(userId);

    if(!user){
       return  next(handleError(403, 'User dosent exist'))
    }
    generateToken(res, userId);

    await sendVerificationEmail(user); 

    const { personal_info: { username:user_username, email:user_email, profile_img}, role, _id, verified} = user

    return res.status(200).json({
        success: true,
        status: 'verification pending', 
        statusCode:200,
        message: `verification link sent to your email'`,
        user:{
            username: user_username,                
            profile_img, 
            userId:_id,
            role,
            verified
        },            
    })         

}catch(error){
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
            
            const { verified } = user

            if(!verified){
                //Send verification email
               const emailSent =  await sendVerificationEmail(user); 

               if(emailSent){
                    return next(handleError(403, "User not Verified, verification link sent to your email"));
                }else{
                    return  next(handleError(403, `User not Verified, couldn't send email, try again`));
                }                   
            }

            // comapare new password with encrypted password
            const validated = await bcrypt.compare(password, user.personal_info.password);

            // If passwords dont match
            if(!validated){
                return next(handleError(403, "Wrong Credentials" ));                 
            }
    
            // generate Access Token 
            generateToken(res, user._id); 

           const { personal_info: { username, fullname, profile_img}, role } = user
            // const expiryTime = new Date(Date.now() + 360000) //1 hour
            return res.status(200).json({
                success: true,
                status: 'Success', 
                message: `Successfully signed in`,                
                user:{
                    username, 
                    fullname, 
                    userId: user._id,              
                    profile_img,
                    role
                }                
            })            
        }else{
            return next(handleError(403, "Already registered using Google" )); 
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

        res.status(200).json({ 
            success: true,
            statusCode: 200, 
            message: 'Password reset successfully.' 
        })
    } catch (error) {
        return next(error)        
    }
}

// @desc a sample private route
// @route GET /api/auth/private'
// @access Private
const changePassword = async (req, res, next) => {
    try {  
        const { _id } = req.user;
        const { newPassword, currentPassword } = req.body;        

        const user = await User.findById(_id);

        if(!passwordRegex.test(newPassword) || !passwordRegex.test(currentPassword)){
            return next(handleError(403, 'Password should be 6 to 20 characters long with a numeric, 1 uppercase and 1 lowercase letter'))
        }

        if(!user){
           return next(handleError(403, 'User not found'))
        }
        
        if(user.google_auth){
            return next(handleError(403, 'User signed-up through google'))
        }

        const {personal_info: {password: savedPassword}} = user

        const validPassword = await bcrypt.compare(currentPassword, savedPassword);

        if(!validPassword){
            return next(handleError(403, 'Incorrect Password'))
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
 
        user.personal_info.password = hashedPassword;
        await user.save();

        res.status(200).json({ 
            success: true,
            statusCode: 200, 
            message: 'Password changed successfully.' 
        })
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
            success: true,
            status:'SUCCESS',
            message:'Password reset OTP sent to user',
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
        let { email, OTP } = req.body

        // Check if user provided details
        if(!email || !OTP){
            return next(handleError(403, 'Empty OTP details are not allowed'));
        }

       // Find the user based on the userId
        const user = await User.findOne({"personal_info.email": email});

        // User doesn't exist
        if(!user){
            return next(handleError(403, `Account record doesn't exist, Please create Account`));
        }

        // If User exists in database, check for the userId in the ResetOTP collections
        const userVerificationRecords = await ResetOTP.findOne({owner: user._id});

        if(!userVerificationRecords){
            //no record found
            return next(handleError(403, `This OTP is already verified`));
        }else{
            // user OTP record exists                
            const { expiresAt, OTP:savedOTP } = userVerificationRecords;
            if(expiresAt < Date.now()){
                // User OTP record has expired, delete ResetOTP
                await ResetOTP.deleteMany({owner:user._id});
                return next(handleError(403, 'OTP has expired. Please request again.'))
            }else{
                // compare generated OTP to the hashed OTP in th database
                const validOTP = await bcrypt.compare(OTP, savedOTP);
                if(!validOTP){
                    // Supplied OTP is wrong
                    return next(handleError(403, 'Invalid code passed, check your inbox.'))
                }else{
                    // success valid OTP
                    const verifiedUser = await User.findOneAndUpdate({_id: user._id}, { verified: true});

                    //  delete the VerificationOTP
                    await ResetOTP.deleteMany({owner:user._id});

                    // Upon successful OTP verification, generate and store the JWT token in cookies
                    generateToken(res, user._id);
                    // const {personal_info: {username,  profile_img}, role} = verifiedUser;
                    return res.status(200).json({
                        success: true, 
                        statusCode: 200,
                        message: `OTP was successfully VERIFIED`,            
                                 
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

        if(!user){// user does not exist
            return  next(handleError(403, `Account doesn't exist`))
          }else{//user exists
              //generate and send new OTP to users email
              await generateAndSendPasswordResetOTP(user);
          }
          return res.status(200).json({
              success: true,
              status:'SUCCESS',
              message:'Password reset OTP sent to user',
          })        
        
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
                const {_id:userId, personal_info: {username, profile_img, fullname}, role } = user            
                 // generate an access token
                generateToken(res, userId);
                
                 // Respond with the user information
                return res.status(200).json({
                    success: true,
                    
                    statusCode:200,
                    message: `Successfully Signed in'`,
                    user:{
                        username,                
                        profile_img, 
                        userId,
                        fullname,
                        role,                
                    },            
                }) 
            }            
        } else {
            // If user does not exist, create a new user with Google authentication            
            const username = name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-8);

            user = new User({
                personal_info: { 
                    fullname: name,
                    username,
                    email,
                    profile_img: photo,
                    role: 'user',
                },
                google_auth: true,
                verified: true
            });

            // Save the new user to the database
            await user.save();
            const {_id:userId, role } = user;

            // generate an access token
            generateToken(res, userId);
        
        // Respond with the user information
        return res.status(200).json({
            success: true,            
            statusCode:200,
            message: `Successfully Signed Up'`,
            user:{
                username,                
                profile_img:photo, 
                userId,
                role,                
            },            
        })         
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
        const { id: userId, token:userToken } = req.params;
        // const { token: userToken } = req.query;

        // check if user exists
        const user = await User.findById(userId);

        if(!user){
           return  next(handleError(403, 'Invalid link'))
        }

        const verificationToken = await VerificationToken.findOne({owner: userId });

        if(!verificationToken){
            return  next(handleError(403, 'Invalid Link'))
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

        await User.updateOne({_id: userId}, {verified:true});

        // Delete verification token from the database
        await VerificationToken.deleteOne({ owner: userId  });

        // const { personal_info: { username:user_username, profile_img}, role, _id, verified} = user;
        const {personal_info: {fullname, username, email, profile_img}, verified, role, _id} = user;

        generateToken(res, _id);

        return res.status(200).json({ 
            success: true, 
            message: 'User successfully verified',
            userId,
            userData: {
                fullname,
                username,
                email,
                profileImg: profile_img,
                verified,
                role,
                userId: _id
            }        
         });
    } catch (error) {
        return next(error);
    }
}

const readCookies= async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if(token === undefined){
            return next(handleError(401, 'cookie not found'));
        } 
        
        if(token){
            const decoded = jwt.verify(token, process.env.SECRET_ACCESS_KEY);
            // Check if decoded is a string (invalid token)
            if (typeof decoded === 'string') {
                return next(handleError(401, 'Invalid token'));
            }
            // Get user from the token
            const user = await User.findById(decoded.userId).select('-personal_info.password');

            const {personal_info: {fullname, username, email, profile_img}, verified, role, _id} = user;

            // run the next middleware
            return res.status(200).json({
                success: true,
                message: 'successfully verified',
                userData: {
                    fullname,
                    username,
                    email,
                    profileImg: profile_img,
                    verified,
                    role,
                    userId: _id
                }
            })
        }else{
            return next(handleError(401, 'token expired'));
        }
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
    verifyUser,
    resendVerificationEmail,
    changePassword,
    readCookies
}