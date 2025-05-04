const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models/models");

// Import routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");

// Khởi tạo Express app
const app = express();

// Thiết lập CORS with more options
app.use(cors({
  origin: '*', // Allow all origins for development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-access-token'],
  credentials: true
}));

// Parse requests of content-type - application/json
app.use(express.json());

// Parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Thiết lập các routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// Route mặc định
app.get("/", (req, res) => {
  res.json({ message: "Chào mừng đến với Museart API." });
});

// Xử lý các routes không tồn tại
app.use((req, res) => {
  res.status(404).json({ message: "API không tồn tại!" });
});

// Thiết lập cổng và khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`Server đang chạy trên cổng ${PORT}.`);
  
  try {
    // Kiểm tra kết nối database
    await sequelize.authenticate();
    console.log("Kết nối database thành công.");
    
    // Đồng bộ hóa models với database
    await sequelize.sync();
    console.log("Đồng bộ hóa models thành công.");
  } catch (error) {
    console.error("Kết nối database thất bại:", error);
  }
});

module.exports = app; 