const express = require("express");
const router = express.Router();
const { createPaymentUrl, handlePaymentReturn } = require("../controllers/payment.controller");
const { verifyToken } = require("../middleware/auth.middleware");

// Create VNPay payment URL (requires authentication)
router.post("/create-payment", verifyToken, createPaymentUrl);

// Handle VNPay payment return (public endpoint)
router.get("/vnpay-return", handlePaymentReturn);

module.exports = router;
