const express = require("express");
const userController = require("../controllers/user.controller");
const { verifyToken } = require("../middleware/auth.middleware");

const router = express.Router();

// Tất cả các routes đều yêu cầu xác thực
router.use(verifyToken);

// Lấy thông tin người dùng
router.get("/profile", userController.getUserProfile);

// Cập nhật thông tin người dùng
router.put("/profile", userController.updateUserProfile);

module.exports = router; 