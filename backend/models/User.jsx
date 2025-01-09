const mongoose = require("mongoose");
const Userschema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phonenumber: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true,
        enum: ["CSE", "ECE", "AI&DS", "ME", "CE", "EE","CS/IT"],
    },
    role: {
        type: String,
        enum: ["Admin", "User","Manager"],
        default: "User"
    },
    registeredActivities: [{
        activity: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Activity'
        },
        registeredAt: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ['registered'],
            default: 'registered'
        }
    }]


})

const UserModel = mongoose.model("User", Userschema);
module.exports = UserModel;