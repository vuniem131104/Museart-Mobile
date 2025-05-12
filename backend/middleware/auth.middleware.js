const dotenv = require("dotenv");
const tokenService = require("../services/token.service");

dotenv.config();

const verifyToken = (req, res, next) => {
  const accessToken = req.headers["x-access-token"];
  const refreshToken = req.headers["x-refresh-token"];

  if (!accessToken) {
    return res.status(403).json({
      message: "No access token provided!",
    });
  }

  // Verify access token
  const decoded = tokenService.verifyAccessToken(accessToken);

  if (decoded) {
    req.userId = decoded.id;
    return next();
  }
  console.log("Access token is invalid");
  // If access token is invalid, check refresh token
  if (!refreshToken) {
    return res.status(403).json({
      message: "No refresh token provided!",
    });
  }

  const refreshDecoded = tokenService.verifyRefreshToken(refreshToken);
  if (!refreshDecoded) {
    return res.status(401).json({
      message: "Invalid refresh token!",
    });
  }

  // Generate new access token
  const newAccessToken = tokenService.generateAccessToken(refreshDecoded.id);

  // Set new access token in response header
  res.setHeader("x-new-access-token", newAccessToken);
  console.log("Refreshed access token");
  // Set user ID for the request
  req.userId = refreshDecoded.id;
  next();
};

module.exports = {
  verifyToken,
};
