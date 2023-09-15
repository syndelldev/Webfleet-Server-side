const jwt = require('jsonwebtoken');
require('dotenv').config();
const JwtSecret = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
  // Extract the token from the request headers
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  // Verify the token's authenticity
  jwt.verify(token, JwtSecret , (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Token is valid; you can access decoded information (e.g., user ID) to determine the user
    req.userId = decoded.userId; // Store the user ID in the request object for future use
    next(); // Proceed to the next middleware or route
  });
};

module.exports = authenticateToken;
