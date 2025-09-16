const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Expecting 'Bearer <token>'

  if (!token) {
    return res.status(403).json({ message: 'Access denied, token missing' });
  }

  // Verify the JWT token
  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: 'Invalid or expired token' });
        }
    
        // Attach user info to the request object
        req.user = decoded;
        next();
      });
    
  } catch (error) {
    return res.status(401).json({ message: 'Token is Not Valid' });

  }
  
};

module.exports = verifyToken;