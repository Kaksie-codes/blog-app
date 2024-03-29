import User from "../models/user.model.js";
import handleError from "../utils/error.js";


const getUsers = async (req, res, next) => {
    try{
        let { query } = req.body;
        let searchedUsers = await User.find({"personal_info.username": new RegExp(query, 'i')})
        .limit(50)
        .select("personal_info.fullname personal_info.username personal_info.profile_img -_id")
        
        res.status(200).json({users:searchedUsers})

    }catch(error){
       return next(error)
    }
}

const getUser = async (req, res, next) => {
    try{
        let { username } = req.body;
        let searchedUser = await User.findOne({"personal_info.username": username})
        .select("-personal_info.password -google_auth -updatedAt -blogPosts")
        
        res.status(200).json({user:searchedUser});
    }catch(error){
       return next(error)
    }
}

export { getUsers, getUser }