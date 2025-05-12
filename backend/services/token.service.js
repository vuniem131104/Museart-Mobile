const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const jwtConfig = require("../config/jwt.config");

dotenv.config();

class TokenService {
  // Generate access token
  generateAccessToken(userId) {
    return jwt.sign({ id: userId }, jwtConfig.secret, {
      expiresIn: jwtConfig.accessTokenExpiration, // e.g. '15m'
    });
  }

  // Generate refresh token
  generateRefreshToken(userId) {
    return jwt.sign({ id: userId }, jwtConfig.refreshSecret, {
      expiresIn: jwtConfig.refreshTokenExpiration, // e.g. '7d'
    });
  }

  // Generate both tokens
  generateTokens(userId) {
    return {
      accessToken: this.generateAccessToken(userId),
      refreshToken: this.generateRefreshToken(userId),
    };
  }

  // Verify access token
  verifyAccessToken(token) {
    try {
      return jwt.verify(token, jwtConfig.secret);
    } catch (error) {
      return null;
    }
  }

  // Verify refresh token
  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, jwtConfig.refreshSecret);
    } catch (error) {
      return null;
    }
  }
}

module.exports = new TokenService();
