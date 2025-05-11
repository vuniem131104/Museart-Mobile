const express = require("express");
const router = express.Router();
const {
  toggleReaction,
  getReactions,
  addComment,
  getComments,
  deleteComment,
} = require("../controllers/exhibition.controller");
const { authenticateToken } = require("../middleware/auth");

// Reaction routes
router.post("/:exhibitionId/reactions", authenticateToken, toggleReaction);
router.get("/:exhibitionId/reactions", getReactions);

// Comment routes
router.post("/:exhibitionId/comments", authenticateToken, addComment);
router.get("/:exhibitionId/comments", getComments);
router.delete("/comments/:commentId", authenticateToken, deleteComment);

module.exports = router;
