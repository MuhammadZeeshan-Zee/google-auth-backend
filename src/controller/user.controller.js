import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const oauth = asyncHandler(async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    
    // Verify Google ID Token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, email, name, picture, exp } = payload;

    // Check if Token is Expired
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    if (exp < currentTime) {
      return res.status(401).json({ message: "Token has expired. Please log in again." });
    }

    // Generate JWT for session management
    const jwtToken = jwt.sign(
      { id: sub, email, name, picture },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token: jwtToken, user: { id: sub, email, name, picture } });

  } catch (error) {
    res.status(500).json({
      message: "Authentication failed",
      error: error.message,
    });
  }
});

export { oauth };
