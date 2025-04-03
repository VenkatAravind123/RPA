const mongoose = require("mongoose")
const express = require("express")
const cors = require("cors")
const userRoutes = require("../Routes/UserRoutes.jsx")
// const bcrypt = require("bcryptjs"); 
const auth = require("../auth.jsx")
require("dotenv").config()

// const getRandomValues = (len) => {
//   const randomValues = new Uint8Array(len);
//   for (let i = 0; i < len; i++) {
//     randomValues[i] = Math.floor(Math.random() * 256);
//   }
//   return randomValues;
// };

// // Set the fallback
// if (typeof bcrypt.setRandomFallback === 'function') {
//   bcrypt.setRandomFallback(len => Array.from(getRandomValues(len)));
//   console.log("Set custom random fallback for bcryptjs");
// }


const app = express()
app.use(express.json())
//'http://localhost:3000'
app.use(cors({
  origin: ['https://klef-rpaclub.vercel.app','http://localhost:3000'], // Replace with your frontend URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
}));
// app.use(cors())



const dburl = process.env.MONGO_URI
mongoose.connect(dburl).then(() => {
    console.log("Connected to the database")
}).catch((err) => {
    console.log(err)
})

// mongoose.connect(dburl, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
//   socketTimeoutMS: 30000, // Close sockets after 30s of inactivity
// }).then(() => {
//     console.log("Connected to the database")
// }).catch((err) => {
//     console.log("MongoDB connection error:", err)
// })

app.get("/", (req, res) => {
  res.send(
    "Welcome to the RPA Club API. Please refer to the documentation for more information."
  );
});

// app.get('/test-bcrypt', async (req, res) => {
//   try {
//     const testPassword = '123456';
//     const hashedPassword = await bcrypt.hash(testPassword, 5);
    
//     res.status(200).json({
//       success: true,
//       message: 'bcryptjs working correctly',
//       hash: hashedPassword
//     });
//   } catch (error) {
//     console.error('bcrypt test error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message
//     });
//   }
// });
//['Admin', 'User', 'Manager']
app.use("/user", userRoutes)
app.get("/protected", auth(), (req, res) => {
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