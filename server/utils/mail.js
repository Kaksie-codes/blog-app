import nodemailer from 'nodemailer'
import ResetOTP from '../models/resetOTP.model.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import VerificationToken from '../models/VerificationToken.model.js';

const generateAndSendPasswordResetOTP = async(user) => {
    try{
        // destructure the user
        const { personal_info: { username, email}, _id:userId} = user;

        // Delete any existing verification tokens associated with the user
        await ResetOTP.deleteMany({owner: userId});

        // Generate the OTP
        const OTP = generateOTP();

        // Hash the OTP
        const saltRounds = 10;
        const hashedOTP = await bcrypt.hash(OTP, saltRounds);

         // create a new Verification token
         const resetToken = new ResetOTP({
            owner: userId,
            OTP: hashedOTP,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000 // expires in 1 hour
        });

        // Save the OTP in the database
        await resetToken.save();

         // Send a mail to the users email address
         const mailOptions = {
            from:`"enBlogg" <nsikakakpan007@hotmail.com>`,
            to: email,
            subject: 'Verify your Email',
            html: generateOTPEmailTemplate(username, OTP)
        }
        await  sendEmail(mailOptions)

    }catch(error){
        throw error;
    }
}

const sendVerificationEmail = async (user) => {
    try{
        // destructure the user
        const { personal_info: { username, email}, _id:userId} = user;  
        
        // Delete verification token from the database
        await VerificationToken.deleteOne({ owner: userId  });
        
        // Generate a random string for verification token
        const unhashedToken = crypto.randomBytes(32).toString('hex'); 

        // Hash the verification token
        const hashedToken = crypto.createHash('sha256').update(unhashedToken).digest('hex');

        const verificationToken = new VerificationToken({
            owner: userId,
            token: hashedToken,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000 // expires in 1 hour
        })
        
        await verificationToken.save();

        // Include the verification token in the link sent to the user's email
        const verificationLink = `https://enblogg.onrender.com/users/${userId}/verify/${unhashedToken}`; // Assuming localhost and port 3000

        // Send a mail to the users email address
         const mailOptions = {
            from:`"enBlogg" <nsikakakpan007@hotmail.com>`,
            to: email,
            subject: 'Verify your Email',
            html: generateVerificationLinkTemplate(username, verificationLink)
        }
       
        const emailSent = await sendEmail(mailOptions);

        if(emailSent){
            return true
        }else{
            return false
        }

    }catch(error){
        throw error;
    }
}





const generateOTP = () => {
    let OTP = '';
    for(let i = 0; i <= 3; i++){
        const randVal = Math.round(Math.random() * 9);
        OTP = OTP + randVal
    }
    return OTP;
}

const sendEmail = async (mailOptions) => {
    try {
        // configure your service
        let config = {
            service: "hotmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            }
        };

        // Create a transporter
        const transporter = nodemailer.createTransport(config);

        // Send email using async/await
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info);

        // Return true if email is sent successfully
        return true;
    } catch (error) {
        console.log('Error sending email:', error);
        // Return false if an error occurs
        return false;
    }
};

const generateOTPEmailTemplate = (username, OTP) => {    
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Password</title>
    </head>
    <body>
        <div style="text-align: center; background-color: #f6f6f6; height: 100vh; width: 100%; ">
            <div style="padding: 10px;">
                <h1 style="font-weight: 600;">enBlogg</h1>
            </div>
            <div style="max-width: 620px; padding: 10px; width: auto; background-color: #ffffff; margin: 0 auto; font-family: sans-serif; color: #272727;">
                <h1 style="color: #272727;">Hello 👋 ${username},</h1>
                <h3 style="text-align: center; font-weight: bold;">Here is your OTP</h3>
                <p style="text-align: center;">to reset your password</p>
                <p style="margin: 0 auto; width: fit-content; font-weight: bold; text-align: center; background: #f6f6f6; border-radius: 5px; font-size: 40px; letter-spacing: 10px;">
                    ${OTP}
                </p>
                <p style="text-align: center; color: red; padding-top: 12px;">valid for 1 hour only</p>
                <p style="text-align: center;">If you didn't send this request, kindly ignore it.</p>
            </div>
        </div>
    </body>
    </html>    
    `
}
const generateVerificationLinkTemplate = (username, link) => {    
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>enBlogg - user verification</title>
    </head>
    <body>
        <div style="text-align: center; background-color: #f6f6f6; height: 100vh; width: 100%; ">
            <div style="padding: 10px;">
                <h1 style="font-weight: 600;">enBlogg</h1>
            </div>
            <div style="max-width: 620px; padding: 10px; width: auto; background-color: #ffffff; margin: 0 auto; font-family: sans-serif; color: #272727;">
                <h1 style="color: #272727;">Hello 👋 ${username},</h1>
                <h3 style="text-align: center; font-weight: bold;">Welcome to <b>enBlogg</b></h3>
                <p style="text-align: center; padding-bottom: 10px;">Click on the link to verify your account</p>
                <a href=${link} style=" color: white; text-decoration: none; padding: 12px 30px; font-weight: bold; text-align: center; background: blue;">
                    Click to Verify
                </a>
                <p style="text-align: center; color: red; padding-top: 12px;">valid for 1 hour only</p>
                <p style="text-align: center;">If you didn't send this request, kindly ignore it.</p>
            </div>
        </div>
    </body>
    </html>    
    `
}

export { generateAndSendPasswordResetOTP, sendVerificationEmail }
