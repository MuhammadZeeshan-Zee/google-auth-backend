import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

/**
 * Middleware to Authenticate User via JWT
 */
const authenticateUser = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(401).json({ message: "Access Denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded; // Attach decoded user info to request
    console.log("req.user",req.user);
    
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token", error: error.message });
  }
};

export default authenticateUser;
