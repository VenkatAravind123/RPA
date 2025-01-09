const jwt = require('jsonwebtoken');

const auth = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).send('Access denied');

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).send('Forbidden');
      }
      req.user = decoded;
      next();
    } catch (error) {
      res.status(400).send('Invalid token');
    }
  };
};

module.exports = auth;