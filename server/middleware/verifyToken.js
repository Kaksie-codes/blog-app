import jwt from 'jsonwebtoken'
import handleError from '../utils/error.js';
import User from '../models/user.model.js';



export const verifyToken = async (req, res, next) => {
    let token
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            if(!token){ 
                return next(handleError(401, 'Unauthorized, no token')); 
            }

            //Verify token
            const decoded = jwt.verify(token, process.env.SECRET_ACCESS_KEY);

            // Get user from the token
            req.user = await User.findById(decoded.id).select('-personal_info.password');

            // run the next middleware
            next()
        } catch (error) {
            console.log(error);
            return next(handleError(401, 'Unauthorized'));  
        }
    }
}

export const verifyToken1 = (req, res, next) => {
    const token = req.cookies.access_token;
    
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

