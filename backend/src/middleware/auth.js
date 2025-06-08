const jwt = require('jsonwebtoken');

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
    // Check for the Authorization header
    const authHeader = req.headers['authorization'];
    
    // If there's no authorization header or the token part is missing, return error
    if (!authHeader) {
        console.log("Authorization header is missing");
        return res.status(401).json({ message: 'Token manquant' }); // Missing token
    }
    
    const token = authHeader.split(' ')[1];  // Split "Bearer <token>" and get the token part
    
    if (!token) {
        console.log("Token is missing");
        return res.status(401).json({ message: 'Token manquant' }); // Missing token part
    }

    console.log("Token received:", token); // Log the token for debugging purposes

    // Check if JWT_SECRET exists in environment
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        console.error("JWT_SECRET is not defined in environment variables");
        return res.status(500).json({ message: 'Internal Server Error: JWT Secret not configured' });
    }

    // Verify the token with the secret key
    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) {
            console.log("Token verification failed:", err);
            return res.status(403).json({ message: 'Token invalide' }); // Invalid token
        }

        // Attach the user information to the request object for further use
        req.user = user; 
        next();  // Proceed to the next middleware or route handler
    });
}

module.exports = authenticateToken;
