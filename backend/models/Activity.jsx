const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema({
    
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        venue: {
            type: String,
            required: true
        },
        price:{
            type:Number,
            required:true
        },
        date:{
            type:Date,
            required:true
        },
        createdBy:{
            type:String,
            required:true
        },
        createdAt:{
            type:Date,
            default:Date.now
        },
    
});

const Activity = mongoose.model("Activity",ActivitySchema);
module.exports = Activity;