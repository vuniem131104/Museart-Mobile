const express = require("express");
const router = express.Router();
const {
  getCartItems,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require("../controllers/cart.controller");
const { verifyToken } = require("../middleware/auth.middleware");

// All cart routes require authentication
router.use(verifyToken);

// Get user's cart items
router.get("/", getCartItems);

// Add item to cart
router.post("/", addToCart);

// Update cart item quantity
router.put("/:cartItemId", updateCartItem);

// Remove item from cart
router.delete("/:cartItemId", removeFromCart);

// Clear cart
router.delete("/", clearCart);

module.exports = router;
