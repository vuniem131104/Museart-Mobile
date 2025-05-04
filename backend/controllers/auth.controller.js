const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/models");
const jwtConfig = require("../config/jwt.config");

// Đăng ký tài khoản mới
exports.signup = async (req, res) => {
  try {
    // Kiểm tra xem email đã tồn tại chưa
    const existingUser = await User.findOne({ where: { email: req.body.email } });
    if (existingUser) {
      return res.status(400).send({ message: "Email đã được sử dụng!" });
    }

    // Tạo user mới
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8)
    });

    res.status(201).send({ 
      message: "Đăng ký thành công!",
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Đăng nhập
exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email
      }
    });

    if (!user) {
      return res.status(404).send({ message: "Email không tồn tại!" });
    }

    // Kiểm tra mật khẩu
    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Mật khẩu không chính xác!"
      });
    }

    // Tạo token
    const token = jwt.sign({ id: user.id }, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn // 24 giờ
    });

    res.status(200).send({
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      accessToken: token
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Đăng xuất - Client sẽ xóa token
exports.signout = (req, res) => {
  // Không cần kiểm tra token hay userId vì việc đăng xuất được xử lý ở phía client
  // Server chỉ cần trả về thông báo thành công
  res.status(200).send({
    message: "Đăng xuất thành công!",
    success: true
  });
};

// Kiểm tra kết nối
exports.testConnection = (req, res) => {
  res.status(200).send({
    message: "Kết nối backend thành công!",
    timestamp: new Date().toISOString()
  });
}; 