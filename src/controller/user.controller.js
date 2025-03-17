import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1m" } // Short-lived access token
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" } // Longer-lived refresh token
  );

  return { accessToken, refreshToken };
};
const oauth = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    // Verify Google ID Token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, email, name, picture, exp } = payload;

    // Check if Token is Expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (exp < currentTime) {
      return res.status(401).json({ message: "Token has expired. Please log in again." });
    }

    // Find or create user in database
    let user = await User.findByPk(sub);
    if (!user) {
      user = await User.create({ id: sub, email, name, picture });
    }

    // Generate Tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Store tokens in the database
    user.accessToken = accessToken;
    user.refreshToken = refreshToken;
    await user.save();

    res.json({ accessToken, refreshToken, user });

  } catch (error) {
    res.status(500).json({ message: "Authentication failed", error: error.message });
  }
};
const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    // Find user by refresh token
    const user = await User.findOne({ where: { refreshToken } });
    if (!user) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // Verify Refresh Token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Invalid refresh token" });

      // Generate new tokens
      const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

      // Update tokens in database
      user.accessToken = accessToken;
      user.refreshToken = newRefreshToken;
      await user.save();

      res.json({ accessToken, refreshToken: newRefreshToken });
    });

  } catch (error) {
    res.status(500).json({ message: "Token refresh failed", error: error.message });
  }
};
export const getUserInfo = async (req, res) => {
  try {
    // `req.user` is set by the authentication middleware
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "name", "email"], // Fetch only specific fields
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user info", error: error.message });
  }
};

export { oauth, refreshAccessToken };
