const express = require("express");
const response = express.Router();
const userroutes = require("../controllers/UserController.jsx");
const {addactivity,getAllActivities,deleteActivity} = require("../controllers/AcitivityController.jsx");
const auth = require("../auth.jsx");




response.post("/register", userroutes.register);
response.post("/login", userroutes.login);
response.post("/addactivity",auth(['Admin','Manager']),addactivity);
response.get("/getallusers",auth(['Admin','Manager']),userroutes.getAllUsers);
response.get("/getallactivities",auth(['Admin','Manager','User']),getAllActivities);
response.get("/getactivities",auth(['User','Admin','Manager']),userroutes.getallActivities);
response.get("/get",userroutes.getallActivities)
response.get("/registeredactivities/:userId",auth(['Admin','Manager','User']),userroutes.viewRegisteredActivities)
response.delete("/deleteactivity/:id",auth(['Admin']),deleteActivity);
response.get("/viewuserbyid/:id", auth(['Admin', 'Manager', 'User']), userroutes.viewUserById);
response.post("/registeractivity/:activityId",auth(['User','Admin','Manager']),userroutes.registerForActivity);
response.put("/updaterole/:id",auth(['Admin','Manager']),userroutes.updateRole);
response.get("/user/viewuserbyemail/:email",auth(['Admin','Manager','User']),userroutes.viewUserByEmail);
response.post("/send-email",userroutes.sendEmail);

module.exports = response;