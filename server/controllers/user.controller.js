import Comment from "../models/Comment.model.js";
import User from "../models/user.model.js";
import handleError from "../utils/error.js";
import Notification from "../models/Notification.model.js"
import BlogPost from "../models/blogPost.model.js"

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

const updateProfileImg = async (req, res, next) => {
    try {
        let { url } = req.body;
        const { _id } = req.user;

        await User.findOneAndUpdate({_id }, {"personal_info.profile_img": url});
        return res.status(200).json({
            success: true,
            message: 'Profile Image successfully updated'
        })
    }catch(error){
        return next(error);   
    }
}

const updateProfile = async (req, res, next) => { // Function to update user profile information
    try { // Start of try block to handle potential errors
        let { username, fullname, bio, social_links } = req.body; // Destructuring user input from request body
        let { _id: userId } = req.user; // Destructuring user ID from request object

        let bioLimit = 150; // Maximum allowed characters for bio

        if (username.length < 3) { // Check if username length is less than 3 characters
            return next(handleError(403, 'Username must be at least 3 characters long')); // Return error if username is too short
        }
        if (fullname.length < 3) { // Check if fullname length is less than 3 characters
            return next(handleError(403, 'Full Name must be at least 3 characters long')); // Return error if fullname is too short
        }
        if (bio.length > bioLimit) { // Check if bio length exceeds the limit
            return next(handleError(403, `Bio should not be ${bioLimit} characters`)); // Return error if bio is too long
        }

        let socialLinksArray = Object.keys(social_links); // Extract keys of social links object

        try { // Nested try block to validate social links
            for (let i = 0; i < socialLinksArray.length; i++) { // Loop through each social link
                if (social_links[socialLinksArray[i]].length) { // Check if social link is provided
                    let hostName = new URL(social_links[socialLinksArray[i]]).hostname; // Extract hostname from social link URL

                    if (!hostName.includes(`${socialLinksArray[i]}.com`) && socialLinksArray[i] !== 'website') { // Check if hostname matches expected pattern for social link
                        return next(handleError(403, `${socialLinksArray[i]} link is invalid. you must enter a valid link`)); // Return error if social link is invalid
                    }
                }
            }
        } catch (error) { // Catch block for URL parsing error
            return next(handleError(500, 'You must provide full social links with http(s) included')); // Return error for incomplete or invalid social links
        }

        let updateObj = { // Create object with updated profile information
            "personal_info.username": username, // Update username
            "personal_info.fullname": fullname, // Update fullname
            "personal_info.bio": bio, // Update bio
            social_links // Update social links
        };

        const user =  await User.findOneAndUpdate({ _id: userId }, updateObj, { // Update user document in the database
            runValidators: true // Validate fields before updating
        });

        const {personal_info: { email, profile_img }, verified, role, _id} = user;       

        return res.status(200).json({ // Return success response
            success: true, // Operation success indicator
            message: 'Profile successfully updated', // Success message
            data: {
                fullname,
                username,
                email,
                profileImg: profile_img,
                verified,
                role,
                userId: _id
            }
        });
    } catch (error) { // Catch block for handling errors
        if (error.code == 11000) { // Check if error code indicates duplicate key (username)
            return next(handleError(409, 'username is already taken')); // Return error for duplicate username
        }
        return next(error); // Forward other errors to the error handling middleware
    }
};

const getAllUsers = async (req, res, next) => {
    try {
        let { page, filter } = req.body;
        let { _id: userId } = req.user; // Destructuring user ID from request object
        filter = filter ? filter.toLowerCase() : 'all'; // Default filter to 'all' if not provided
        page = page ? parseInt(page) : 1;
        const maxLimit = 10;  

        let findQuery = {};

        // Determine filter conditions
        if (filter === 'verified') {
            findQuery.verified = true;
        } else if (filter === 'unverified') {
            findQuery.verified = false;
        }

        // If filter is 'all', do not apply any additional filter
        // If user is logged in, exclude their own ID from the query
        if (userId) {
            findQuery._id = { $ne: userId };
        }

        const users = await User.find(findQuery)
        .skip((page - 1) * maxLimit)
        .limit(maxLimit)
        .select("joinedAt personal_info role verified _id");

        const totalCount = await User.find(findQuery).countDocuments();
        const totalPages = Math.ceil(totalCount / maxLimit);

        console.log('totalKount ===>>', totalCount)

        res.status(200).json({ 
            success: true, 
            data: users,
            currentPage:page,
            totalCount,
            totalPages 
        });
    } catch (error) {
        return next(error);
    } 
} 

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

const searchUsers = async (req, res, next) => {
    try {        
        let { query } = req.query;        
        let { _id: userId } = req.user;              
        const maxLimit = 30;

        let searchQuery = {}
        if(query){
            searchQuery = { 
                $or: [
                    { "personal_info.username": new RegExp(query, 'i') },
                    { "personal_info.fullname": new RegExp(query, 'i') }
                ],
                _id: { $ne: userId }
            };  
        }   
        
        const users = await User.find(searchQuery)                                                              
        .limit(maxLimit)
        .select("joinedAt personal_info role verified _id");
        

        res.status(200).json({ 
            success: true, 
            data: users 
        });
    } catch (error) { 
        return next(error);
    } 
}
 
const deleteUser = async (req, res, next) => {
    try {
        const { userId } = req.body;

        // Find the user by ID and delete it
        const deletedUser = await User.findByIdAndDelete(userId);        

        await Notification.deleteMany({user: userId});
        console.log('notifications deleted');

        await Comment.deleteMany({commented_by: userId});
        console.log('comments deleted');

        await BlogPost.deleteMany({author: userId});
        console.log('blogposts deleted');

        if (!deletedUser) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        res.json({ success: true, message: "User deleted successfully." });
    } catch (error) {
        return next(error);
    }
}

export { 
    getUsers, 
    getUser,
    updateProfile,
    updateProfileImg,
    getAllUsers,
    deleteUser,
    searchUsers
}