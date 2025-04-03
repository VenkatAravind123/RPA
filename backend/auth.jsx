const jwt = require('jsonwebtoken');
const User = require('./models/User.jsx'); // Adjust the path to your User model

const auth = (roles) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const user = await User.findById(decoded.userId).select('-password');
      if (!user) {
        return res.status(404).send('User not found');
      }
      if (!roles.includes(user.role)) {
        return res.status(403).send('Access denied');
      }
      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      res.status(401).send('Unauthorized');
    }
  };
};

module.exports = auth;