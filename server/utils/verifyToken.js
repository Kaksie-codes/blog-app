import jwt from 'jsonwebtoken'
import handleError from './error.js'


export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    console.log('token', token)
    if(!token){ 
        next(handleError(401, 'Unauthorized')); 
    }

    jwt.verify(token, process.env.SECRET_ACCESS_KEY, (err, user) => {
        if(err){
            next(handleError(401, 'Unauthorized'));              
        }

        req.user = user;
        next(); // Proceed to the next middleware only if the token is successfully verified
    });
};

