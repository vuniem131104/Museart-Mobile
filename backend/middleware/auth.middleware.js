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

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    
    if (!user) {
      return res.status(404).send({
        message: "User not found"
      });
    }
    
    if (user.role !== 'admin') {
      return res.status(403).send({
        message: "Require Admin Role!"
      });
    }
    
    next();
  } catch (error) {
    return res.status(500).send({
      message: "Unable to validate Admin role!"
    });
  }
};

module.exports = {
  verifyToken,
  isAdmin
}; 