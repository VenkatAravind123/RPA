const mongoose = require("mongoose")
const express = require("express")
const cors = require("cors")
const userRoutes = require("../Routes/UserRoutes.jsx")
const bcrypt = require("bcryptjs"); 
const auth = require("../auth.jsx")
require("dotenv").config()

try {
  const crypto = require('crypto');
  bcrypt.setRandomFallback((len) => {
    return Array.from(crypto.randomBytes(len));
  });
  console.log("Set crypto fallback for bcrypt");
} catch (error) {
  console.warn("Could not set crypto fallback:", error.message);
  // Provide a simple non-secure fallback as a last resort
  bcrypt.setRandomFallback((len) => {
    const arr = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      arr[i] = Math.floor(Math.random() * 256);
    }
    return Array.from(arr);
  });
  console.warn("Using non-secure random fallback for bcrypt");
}


const app = express()
app.use(express.json())
//'http://localhost:3000'
app.use(cors({
  origin: ['https://klef-rpaclub.vercel.app'], // Replace with your frontend URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));
// app.use(cors())



const dburl = process.env.MONGO_URI
// mongoose.connect(dburl).then(() => {
//     console.log("Connected to the database")
// }).catch((err) => {
//     console.log(err)
// })

mongoose.connect(dburl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 30000, // Close sockets after 30s of inactivity
}).then(() => {
    console.log("Connected to the database")
}).catch((err) => {
    console.log("MongoDB connection error:", err)
})

app.get("/", (req, res) => {
  res.send(
    "Welcome to the RPA Club API. Please refer to the documentation for more information."
  );
});


app.use("/user", userRoutes)
app.get("/protected", auth(['Admin', 'User', 'Manager']), (req, res) => {
  const user = {
    email: req.user.email,
    role: req.user.role,
    name: req.user.name,
    _id: req.user._id,
    // other user data
  };
  console.log(user.email)
  res.json(user);
});

const PORT = process.env.PORT || 2021;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})