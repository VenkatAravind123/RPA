const jwt = require('jsonwebtoken');
const User = require('./models/User.jsx');

// Make roles parameter optional with default
const auth = (roles = ["User", "Admin", "Manager"]) => {
  return async (req, res, next) => {
    try {
      console.log("Auth middleware called");
      
      // Check if authorization header exists
      if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        console.log("No authorization header or Bearer token");
        return res.status(401).json("No token provided");
      }
      
      const token = req.headers.authorization.split(' ')[1];
      console.log("Token received:", token.substring(0, 15) + "...");
      
      // CRITICAL FIX: Add fallback secret key for development
      const secret = process.env.JWT_SECRET_KEY || "fallback_secret_key";
      console.log("Using JWT secret:", secret ? "Secret available" : "No secret found");
      
      try {
        const decoded = jwt.verify(token, secret);
        console.log("Token decoded successfully:", {
          id: decoded._id, 
          email: decoded.email,
          role: decoded.role
        });
        
        // Find user by ID
        const user = await User.findById(decoded._id).select('-password');
        
        if (!user) {
          console.log("User not found with ID:", decoded._id);
          return res.status(404).json('User not found');
        }
        
        console.log("User found:", user.email, "Role:", user.role);
        
        // Optional role check
        if (roles.length > 0 && !roles.includes(user.role)) {
          console.log(`Access denied: User role ${user.role} not in authorized roles:`, roles);
          return res.status(403).json('Access denied');
        }
        
        req.user = user;
        next();
      } catch (jwtError) {
        console.error("JWT verification error:", jwtError.message);
        return res.status(401).json("Invalid token");
      }
    } catch (error) {
      console.error("Auth middleware error:", error);
      
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json("Invalid token format");
      }
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json("Token expired");
      }
      
      res.status(500).json('Server authentication error');
    }
  };
};

module.exports = auth;