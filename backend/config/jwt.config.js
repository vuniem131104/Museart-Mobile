module.exports = {
  secret: process.env.ACCESS_TOKEN_KEY,
  refreshSecret: process.env.REFRESH_TOKEN_KEY,
  accessTokenExpiration: "30m", // Access token expires in 30 seconds
  refreshTokenExpiration: "7d", // Refresh token expires in 7 days
};
