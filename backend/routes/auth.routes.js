const express = require("express");
const authController = require("../controllers/auth.controller");

const router = express.Router();

// Đăng ký tài khoản mới
router.post("/signup", authController.signup);

// Đăng nhập
router.post("/signin", authController.signin);

// Đăng xuất
router.post("/signout", authController.signout);

// Kiểm tra kết nối
router.get("/test", authController.testConnection);

module.exports = router; 