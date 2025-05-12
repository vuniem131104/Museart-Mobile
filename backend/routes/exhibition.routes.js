const express = require("express");
const router = express.Router();
const {
  toggleReaction,
  getReactions,
  addComment,
  getComments,
  deleteComment,
  checkUserReaction,
} = require("../controllers/exhibition.controller");
const { verifyToken } = require("../middleware/auth.middleware");

// Reaction routes
router.post("/:exhibitionId/reactions", verifyToken, toggleReaction);
router.get("/:exhibitionId/reactions", getReactions);
router.get("/:exhibitionId/check-reaction", verifyToken, checkUserReaction);

// Comment routes
router.post("/:exhibitionId/comments", verifyToken, addComment);
router.get("/:exhibitionId/comments", getComments);
router.delete("/comments/:commentId", verifyToken, deleteComment);

module.exports = router;
