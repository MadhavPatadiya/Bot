
const jwt = require("jsonwebtoken");
const roles = {
   
    ADMIN: 'admin',
    USER: 'user',
        
        
        
    

};
const checkUserRole = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            const token = req.headers.authorization;
            if (!token) return res.status(401).json({ error: 'Access denied. Token missing.' });

            const decodedToken = jwt.verify(token, "your-secret-key");

            // Check if decoded token contains necessary user information
            if (!decodedToken.userId || !decodedToken.userType) {
                return res.status(401).json({ error: 'Invalid token. Missing user information.' });
            }

            // Check if user's role is allowed
            if (!allowedRoles.includes(decodedToken.userType)) {
                return res.status(403).json({ error: 'Access denied. User role not permitted for this action.' });
            }

            // Attach user information to the request object
            req.user = {
                userId: decodedToken.userId,
                userType: decodedToken.userType,
              //  Company_Code: decodedToken.Company_Code
            };

            // Continue to the next middleware or route handler
            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ error: 'Invalid token' });
        }
    };
};

module.exports = {
    roles,
    checkUserRole,
};