const user = require("../models/User.jsx");
const activity = require("../models/Activity.jsx")
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);
const jwt = require("jsonwebtoken");
 
// Register a new user
const register = async(request,response)=>{
    try{
        const { name, email, phonenumber, password, department, role } = request.body;

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user1 = new user({
        name,
        email,
        phonenumber,
        password: hashedPassword,
        department,
        role,
    });
    await user1.save();
    response.status(200).send("User Registered Successfully");

    }
    catch(error){
        console.error(error)
        response.status(500).send("Internal Server Error")
    }
}


const login = async (request,response) =>{
    try{
        const {email,password} = request.body;
        const user1 = await user.findOne({email:email});
        if(!user1){
            return response.status(400).send("Invalid Credentials");
        }
        const validPassword = await bcrypt.compare(password,user1.password);
        if(!validPassword){
            return response.status(400).send("Invalid Credentials");
        }
        const token = jwt.sign({userId:user1._id,email:user1.email,name:user1.name,role:user1.role},process.env.JWT_SECRET_KEY,{expiresIn:"1h"});
        response.json({token})
    }
    catch(error){
        console.error(error)
        response.status(500).send("Internal Server Error")
    }
}

const getAllUsers = async (request,response) =>{
    try{
        const users = await user.find({},'-password');
        response.status(200).json(users);
    }
    catch(error)
    {
        console.error(error);
        response.status(500).send("Internal Server Error");
    }
}



const getallActivities = async (request, response) => {
    try {
        const activities = await activity.find();
        
        if (!activities) {
            return response.status(404).json({ 
                success: false, 
                message: "No activities found" 
            });
        }

        return response.status(200).json({
            success: true,
            data: activities,
            message: "Activities fetched successfully"
        });
    } catch (error) {
        console.error("Error fetching activities:", error);
        return response.status(500).json({
            success: false,
            message: "Error fetching activities",
            error: error.message
        });
    }
};

const viewUserById = (request,response) =>{
    try{
        const id = request.params.id;
        console.log(id);
        const user1 = user.findById(id);
        if(!user1){
            return response.status(404).send("User not found");
        }
        response.status(200).json(user1);
    }
    catch(error){
        console.error(error);
        response.status(500).send("Internal Server Error");
    }
}


const registerForActivity = async(request, response) => {
    try {
        const decoded = jwt.verify(request.headers.authorization.split(' ')[1], process.env.JWT_SECRET_KEY);
        const userId = decoded.userId;
        const activityId = request.params.activityId;

        const currentUser = await user.findById(userId);
        if (!currentUser) {
            return response.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const activityExists = await activity.findById(activityId);
        if (!activityExists) {
            return response.status(404).json({
                success: false,
                message: "Activity not found"
            });
        }

        const isAlreadyRegistered = currentUser.registeredActivities.some(
            activity => activity.activity.toString() === activityId
        );

        if (isAlreadyRegistered) {
            return response.status(400).json({
                success: false,
                message: "Already registered for this activity"
            });
        }

        currentUser.registeredActivities.push({
            activity: activityId,
            registeredAt: new Date()
        });

        await currentUser.save();

        return response.status(200).json({
            success: true,
            message: "Successfully registered for activity"
        });

    } catch (error) {
        console.error("Register activity error:", error);
        return response.status(500).json({
            success: false,
            message: "Error registering for activity",
            error: error.message
        });
    }
};

const updateRole = async (request,response) => {
    try{
        const id = request.params.id;
        const role = request.body.role;
        const user1 = await user.findById(id);
        if(!user1){
            return response.status(404).send("User not found");
        }
        user1.role = role;
        await user1.save();
        response.status(200).send("Role Updated Successfully");
    }
    catch(error){
        console.error(error);
        response.status(500).send("Internal Server Error");
    }
}

module.exports = {register,login,getAllUsers,getallActivities,viewUserById,registerForActivity,updateRole}