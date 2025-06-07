const { VNPay, ignoreLogger, consoleLogger, ProductCode, dateFormat, VnpLocale } = require('vnpay');
const { User, CartItem, StoreItem } = require("../models/models");
const sequelize = require("../models/config.models");
require('dotenv').config();

// VNPay configuration from environment variables
const vnpay = new VNPay({
    tmnCode: process.env.VNPAY_TMN_CODE,
    secureSecret: process.env.VNPAY_SECURE_SECRET,
    vnpayHost: process.env.VNPAY_HOST,
    testMode: true,
    hashAlgorithm: 'SHA512',
    enableLog: true,
    loggerFn: consoleLogger,
});

// Create VNPay payment URL
const createPaymentUrl = async (req, res) => {
    try {
        // Get request parameters
        const { orderInfo, returnUrl } = req.body;

        if (!orderInfo || !returnUrl) {
            return res.status(400).json({
                message: "Missing required parameters: orderInfo, returnUrl"
            });
        }

        // Generate expiration date (tomorrow)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Generate payment URL
        const paymentUrl = vnpay.buildPaymentUrl(
            {
                // Fixed amount for testing: 10,000 VND
                vnp_Amount: 10000,
                vnp_IpAddr: req.ip || '127.0.0.1',
                vnp_TxnRef: Date.now().toString(), // Unique transaction reference
                vnp_OrderInfo: orderInfo,
                vnp_OrderType: ProductCode.Other,
                vnp_ReturnUrl: returnUrl,
                vnp_Locale: VnpLocale.VN,
                vnp_CreateDate: dateFormat(new Date()),
                vnp_ExpireDate: dateFormat(tomorrow),
            },
            {
                logger: {
                    type: 'all',
                    loggerFn: consoleLogger,
                },
            },
        );

        return res.status(200).json({ paymentUrl });
    } catch (error) {
        console.error("Error creating payment URL:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Handle VNPay payment return
const handlePaymentReturn = async (req, res) => {
    try {
        const vnpParams = req.query;

        // Verify payment response
        const isValidResponse = vnpay.verifyReturnUrl(vnpParams);

        if (!isValidResponse) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment response"
            });
        }

        // Check payment status
        const vnp_ResponseCode = vnpParams.vnp_ResponseCode;
        const vnp_TransactionStatus = vnpParams.vnp_TransactionStatus;

        // Payment successful
        if (vnp_ResponseCode === '00' && vnp_TransactionStatus === '00') {
            // Here you would typically:
            // 1. Update order status in your database
            // 2. Clear the user's cart
            // 3. Create order history record

            return res.status(200).json({
                success: true,
                message: "Payment successful",
                data: vnpParams
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Payment failed",
                data: vnpParams
            });
        }
    } catch (error) {
        console.error("Error handling payment return:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = {
    createPaymentUrl,
    handlePaymentReturn
};
