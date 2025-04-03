const jwt = require('jsonwebtoken');
const User = require('./models/User.jsx');

// Make roles parameter optional with default
const auth = (roles = ["User", "Admin","Manager"]) => {
  return async (req, res, next) => {
    try {
      // Check if authorization header exists
      if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        return res.status(401).json("No token provided");
      }
      
      const token = req.headers.authorization.split(' ')[1];
      
      // IMPORTANT: Use the same secret key name as in login function
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      
      // CRITICAL FIX: Match the field names from your token
      // In UserController.jsx you use _id but here you look for userId
      const user = await User.findById(decoded._id).select('-password');
      
      if (!user) {
        return res.status(404).json('User not found');
      }
      
      // Optional role check, if roles is provided
      if (roles.length > 0 && !roles.includes(user.role)) {
        return res.status(403).json('Access denied');
      }
      
      req.user = user;
      next();
    } catch (error) {
      console.error("Auth error:", error);
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json("Invalid token");
      }
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json("Token expired");
      }
      res.status(401).json('Unauthorized');
    }
  };
};

module.exports = auth;