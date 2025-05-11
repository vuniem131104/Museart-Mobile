const express = require("express");
const router = express.Router();
const {
  toggleReaction,
  getReactions,
  checkUserReaction,
  addComment,
  getComments,
  deleteComment,
} = require("../controllers/artwork.controller");
const { authenticateToken } = require("../middleware/auth");

// Reaction routes
router.post("/:artworkId/reactions", authenticateToken, toggleReaction);
router.get("/:artworkId/reactions", getReactions);
router.get("/:artworkId/check-reaction", authenticateToken, checkUserReaction);
// Comment routes
router.post("/:artworkId/comments", authenticateToken, addComment);
router.get("/:artworkId/comments", getComments);
router.delete("/comments/:commentId", authenticateToken, deleteComment);

module.exports = router;
