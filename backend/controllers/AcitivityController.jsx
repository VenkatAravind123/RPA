const activity = require("../models/Activity.jsx");

// Add a new activity
const addactivity = async(request,response)=>{
    try{
        const { name, description, image, venue,price,date} = request.body;
        // const createdBy = request.user.name;
        // console.log(createdBy)
        const createdBy  = request.user.name
        console.log(createdBy)

        const newactivity = new activity({
            name,
            description,
            image,
            venue,
            price,
            date,
            createdBy
        })

        await newactivity.save();
        response.status(201).json(newactivity);
    }
    catch(error)
    {
        console.error(error);
        response.status(500).send("Internal Server Error");
    }
}


const getAllActivities = async (request, response) => {
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


const deleteActivity = async (request, response) => {
    try {
        const id = request.params.id; // Changed from _id to id to match route param
        const myactivity = await activity.findById(id);
        
        if (!myactivity) {
            return response.status(404).json({
                success: false,
                message: "Activity not found"
            });
        }

        await activity.findByIdAndDelete(id);
        return response.status(200).json({
            success: true,
            message: "Activity deleted successfully"
        });
    } catch (error) {
        console.error("Delete error:", error);
        return response.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const getActivityById = (request,response) =>{
    try{
        const id = request.params.id;
        console.log(id);
        const activity1 = activity.findById(id);
        if(!activity1){
            return response.status(404).send("Activity not found");
        }
        response.status(200).json(activity1);
    }
    catch(error){
        console.error(error);
        response.status(500).send("Internal Server Error");
    }
}


// ...existing code...


module.exports  = {addactivity,getAllActivities,deleteActivity,getActivityById};