const { User } = require("../models/models");

// Lấy thông tin người dùng hiện tại
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: ['id', 'username', 'email']
    });
    
    if (!user) {
      return res.status(404).send({ message: "Không tìm thấy người dùng!" });
    }
    
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Cập nhật thông tin người dùng
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    
    if (!user) {
      return res.status(404).send({ message: "Không tìm thấy người dùng!" });
    }
    
    // Cập nhật thông tin người dùng
    if (req.body.username) user.username = req.body.username;
    // Không cho phép cập nhật email và mật khẩu qua API này
    
    await user.save();
    
    res.status(200).send({ 
      message: "Cập nhật thông tin thành công!",
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