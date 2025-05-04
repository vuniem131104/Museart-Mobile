const jwt = require("jsonwebtoken");
const { User } = require("../models/models");
const jwtConfig = require("../config/jwt.config");

const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "Không có token được cung cấp!"
    });
  }

  jwt.verify(token, jwtConfig.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Không được phép!"
      });
    }
    req.userId = decoded.id;
    next();
  });
};

module.exports = {
  verifyToken
}; 