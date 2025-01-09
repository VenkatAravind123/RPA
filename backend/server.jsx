const mongoose = require("mongoose")
const express = require("express")
const cors = require("cors")
const userRoutes = require("./Routes/UserRoutes.jsx")
const auth = require("./auth.jsx")
require("dotenv").config()
const app = express()
app.use(express.json())

app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));



const dburl = process.env.MONGO_URI
mongoose.connect(dburl).then(() => {
    console.log("Connected to the database")
}).catch((err) => {
    console.log(err)
})


app.use("/user", userRoutes)
// app.get("/protected",auth(['Admin','User','Manager']),(request,response)=>{
//     response.send("You have access to this resource")
// })
app.get("/protected", auth(['Admin', 'User', 'Manager']), (req, res) => {
  const user = {
    email: req.user.email,
    role: req.user.role,
    name: req.user.name,
    id: req.user._id,
    // other user data
  };
  console.log(user.name)
  res.json(user);
});

const PORT = process.env.PORT || 2021;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})