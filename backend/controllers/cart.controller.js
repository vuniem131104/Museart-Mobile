const { CartItem, StoreItem, User } = require("../models/models");
const sequelize = require("../models/config.models");
const axios = require("axios");

// Get user's cart items
const getCartItems = async (req, res) => {
  try {
    const userId = req.userId;

    // Disable foreign key checks to allow retrieving cart items even if StoreItem doesn't exist
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");

    // First get all cart items without including StoreItem
    const cartItems = await CartItem.findAll({
      where: { user_id: userId }
    });

    // For each cart item, try to get the associated StoreItem, but handle the case where it doesn't exist
    const cartItemsWithDetails = await Promise.all(cartItems.map(async (cartItem) => {
      const item = await StoreItem.findByPk(cartItem.item_id);

      // If the item exists, return it with details
      if (item) {
        return {
          id: cartItem.id,
          user_id: cartItem.user_id,
          item_id: cartItem.item_id,
          quantity: cartItem.quantity,
          added_at: cartItem.added_at,
          item: {
            id: item.id,
            name: item.name,
            description: item.description,
            image_url: item.image_url,
            price: item.price
          }
        };
      }
      // If the item doesn't exist, use the API data instead
      else {
        try {
          // Try to fetch item data from the API
          const response = await axios.get(`https://api.artic.edu/api/v1/products/${cartItem.item_id}`);
          const apiItem = response.data.data;

          return {
            id: cartItem.id,
            user_id: cartItem.user_id,
            item_id: cartItem.item_id,
            quantity: cartItem.quantity,
            added_at: cartItem.added_at,
            item: {
              id: apiItem.id,
              name: apiItem.title,
              description: apiItem.description || "",
              image_url: apiItem.image_url,
              price: apiItem.max_current_price
            }
          };
        } catch (apiError) {
          // If API fetch fails, return with minimal data
          console.error(`Failed to fetch item ${cartItem.item_id} from API:`, apiError);
          return {
            id: cartItem.id,
            user_id: cartItem.user_id,
            item_id: cartItem.item_id,
            quantity: cartItem.quantity,
            added_at: cartItem.added_at,
            item: {
              id: cartItem.item_id,
              name: `Product ${cartItem.item_id}`,
              description: "",
              image_url: "",
              price: 0
            }
          };
        }
      }
    }));

    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");

    res.json(cartItemsWithDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { itemId, quantity = 1 } = req.body;

    // Check if item is already in cart (ignore foreign key constraints)
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
    const existingCartItem = await CartItem.findOne({
      where: {
        user_id: userId,
        item_id: itemId
      }
    });

    if (existingCartItem) {
      // Update quantity if item already exists in cart
      existingCartItem.quantity += parseInt(quantity);
      await existingCartItem.save();
      await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
      return res.json({
        message: "Cart item quantity updated",
        cartItem: existingCartItem
      });
    }

    // Add new item to cart (ignore foreign key constraints)
    const cartItem = await CartItem.create({
      user_id: userId,
      item_id: itemId,
      quantity: parseInt(quantity),
      added_at: new Date()
    });
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");

    res.status(201).json({
      message: "Item added to cart successfully",
      cartItem
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const userId = req.userId;
    const { cartItemId } = req.params;
    const { quantity } = req.body;

    // Disable foreign key checks
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");

    const cartItem = await CartItem.findOne({
      where: {
        id: cartItemId,
        user_id: userId
      }
    });

    if (!cartItem) {
      await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
      return res.status(404).json({ message: "Cart item not found" });
    }

    // If quantity is 0 or less, remove the item
    if (quantity <= 0) {
      await cartItem.destroy();
      await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
      return res.json({ message: "Cart item removed successfully" });
    }

    // Update quantity
    cartItem.quantity = parseInt(quantity);
    await cartItem.save();
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");

    res.json({
      message: "Cart item updated successfully",
      cartItem
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { cartItemId } = req.params;

    // Disable foreign key checks
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");

    const cartItem = await CartItem.findOne({
      where: {
        id: cartItemId,
        user_id: userId
      }
    });

    if (!cartItem) {
      await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
      return res.status(404).json({ message: "Cart item not found" });
    }

    await cartItem.destroy();
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");

    res.json({ message: "Cart item removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Clear cart
const clearCart = async (req, res) => {
  try {
    const userId = req.userId;

    // Disable foreign key checks
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");

    await CartItem.destroy({
      where: {
        user_id: userId
      }
    });

    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");

    res.json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getCartItems,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};
