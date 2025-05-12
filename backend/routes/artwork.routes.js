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
const { verifyToken } = require("../middleware/auth.middleware");

// Reaction routes
router.post("/:artworkId/reactions", verifyToken, toggleReaction);
router.get("/:artworkId/reactions", getReactions);
router.get("/:artworkId/check-reaction", verifyToken, checkUserReaction);
// Comment routes
router.post("/:artworkId/comments", verifyToken, addComment);
router.get("/:artworkId/comments", getComments);
router.delete("/comments/:commentId", verifyToken, deleteComment);

module.exports = router;
