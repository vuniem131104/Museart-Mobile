const bcrypt = require("bcryptjs");
const { User } = require("../models/models");
const tokenService = require("../services/token.service");

// Đăng ký tài khoản mới
exports.signup = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // Kiểm tra xem email đã tồn tại chưa
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã được sử dụng!" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Generate tokens
    const tokens = tokenService.generateTokens(user.id);

    res.status(201).json({
      message: "Đăng ký thành công!",
      user: {
        // id: user.id,
        username: user.username,
        email: user.email,
      },
      ...tokens,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Đăng nhập
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate tokens
    const tokens = tokenService.generateTokens(user.id);

    res.json({
      message: "Login successful",
      user: {
        // id: user.id,
        username: user.username,
        email: user.email,
      },
      ...tokens,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Đăng xuất - Client sẽ xóa token
exports.signout = async (req, res) => {
  res.json({ message: "Logged out successfully" });
};

// Kiểm tra kết nối
exports.testConnection = (req, res) => {
  res.status(200).send({
    message: "Kết nối backend thành công!",
    timestamp: new Date().toISOString(),
  });
};
