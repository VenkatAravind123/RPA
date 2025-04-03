const user = require("../models/User.jsx");
const activity = require("../models/Activity.jsx")
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');


// Register a new user

const register = async(request, response) => {
    try {
        const { name, email, phonenumber, password, department, role } = request.body;

        // Check if user already exists
        const existingUser = await user.findOne({ email });
        if (existingUser) {
            return response.status(400).json({ message: "Email already registered" });
        }

        // Store password as plain text - NO HASHING
        const user1 = new user({
            name,
            email,
            phonenumber,
            password: password, // PLAIN TEXT PASSWORD
            department,
            role: role || "User",
        });

        console.log("Registering user with plain text password");
        
        await user1.save();
        response.status(200).json({ message: "User Registered Successfully" });
    }
    catch(error) {
        console.error("Registration error:", error);
        response.status(500).json({ message: "Registration failed", error: error.message });
    }
};




// Login function with enhanced debugging
const login = async (request, response) => {
    try {
        const { email, password } = request.body;
        
        // Log the request body
        console.log("Login attempt:", { 
            email, 
            password: password ? "Password provided" : "No password", 
            passwordLength: password ? password.length : 0 
        });
        
        if (!email || !password) {
            console.log("Missing email or password");
            return response.status(400).json({ message: "Email and password are required" });
        }
        
        // Find user by email
        const userData = await user.findOne({ email });
        
        // Debug user lookup
        if (!userData) {
            console.log("No user found with email:", email);
            return response.status(401).json({ message: "Invalid email or password" });
        }
        
        console.log("User found:", {
            id: userData._id,
            email: userData.email,
            role: userData.role,
            passwordStored: userData.password ? "Password exists" : "No password stored",
            passwordLength: userData.password ? userData.password.length : 0
        });
        
        // Direct plain text comparison
        const validPassword = (password === userData.password);
        console.log("Password check:", { 
            match: validPassword,
            inputLength: password.length,
            storedLength: userData.password.length
        });
        
        if (!validPassword) {
            return response.status(401).json({ message: "Invalid email or password" });
        }
        
        // JWT token creation
        try {
            // Add a fallback secret key for development
            const secretKey = process.env.JWT_SECRET_KEY || "fallback_secret_key";
            console.log("Using JWT secret:", secretKey ? "Secret available" : "No secret");
            
            const token = jwt.sign(
                { 
                    _id: userData._id, 
                    email: userData.email, 
                    role: userData.role,
                    name: userData.name
                },
                secretKey,
                { expiresIn: '1d' }
            );
            
            console.log("Login successful, token generated");
            return response.status(200).json({ token, role: userData.role });
        } catch (jwtError) {
            console.error("JWT token generation error:", jwtError);
            return response.status(500).json({ message: "Error generating authentication token" });
        }
    } catch (error) {
        console.error("Login error:", error);
        return response.status(500).json({ message: "Login failed", error: error.message });
    }
};

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

// const viewUserById = (request,response) =>{
//     try{
//         const id = request.params.id;
//         console.log(id);
//         const user1 = user.findById(id);
//         if(!user1){
//             return response.status(404).send("User not found");
//         }
//         response.status(200).json(user1);
//     }
//     catch(error){
//         console.error(error);
//         response.status(500).send("Internal Server Error");
//     }
// }
const viewUserById = async (request, response) => {
    try {
        const id = request.params.id;
        //console.log('Fetching user with ID:', id);
        
        const user1 = await user.findById(id);
        if (!user1) {
            return response.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        
        //console.log('Found user:', user1);
        return response.status(200).json(user1);
    } catch (error) {
        console.error('Error in viewUserById:', error);
        return response.status(500).json({
            success: false,
            message: "Error fetching user",
            error: error.message
        });
    }
};

const viewUserByEmail = async (request, response) => {
    try {
        const email = request.params.email;
        console.log(email);
        const user1 = await user.findOne({ email: email });
        if (!user1) {
            return response.status(404).send("User not found");
        }
        response.status(200).json(user1);
    } catch (error) {
        console.error(error);
        response.status(500).send("Internal Server Error");
    }
};

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

const viewRegisteredActivities = async (request, response) => {
    try {
        // Get user ID from auth token
        const userId = request.user.id;

        // Find user and populate registered activities
        const userData = await user.findById(userId)
            .populate({
                path: 'registeredActivities',
                populate: {
                    path: 'activity',
                    model: 'Activity',
                    select: 'name description venue date price image'
                }
            });

        if (!userData) {
            return response.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check if user has registered activities
        if (!userData.registeredActivities || userData.registeredActivities.length === 0) {
            return response.status(200).json({
                success: true,
                data: [],
                message: "No registered activities found"
            });
        }

        return response.status(200).json({
            success: true,
            data: userData.registeredActivities,
            message: "Registered activities retrieved successfully"
        });
    } catch (error) {
        console.error("Error in viewRegisteredActivities:", error);
        return response.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

const sendEmail = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: email,
            to: process.env.EMAIL_USER,
            subject: `New Contact Form Message from ${name}`,
            html: `
                <h3>New Contact Form Submission</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
        console.error('Email error:', error);
        res.status(500).json({ success: false, message: 'Failed to send email' });
    }
};

module.exports = {register,login,getAllUsers,getallActivities,viewUserById,registerForActivity,updateRole,viewRegisteredActivities,sendEmail,viewUserByEmail}