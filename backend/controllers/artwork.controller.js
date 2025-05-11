const {
  Artwork,
  ArtworkReaction,
  ArtworkComment,
  User,
} = require("../models/models");

// Like/Unlike artwork
const toggleReaction = async (req, res) => {
  try {
    const { artworkId } = req.params;
    const userId = req.user.id; // Assuming you have authentication middleware
    const { type } = req.body;

    const existingReaction = await ArtworkReaction.findOne({
      where: {
        user_id: userId,
        artwork_id: artworkId,
      },
    });

    if (existingReaction) {
      if (existingReaction.type === type) {
        // If same reaction type, remove it (unlike)
        await existingReaction.destroy();
        return res.json({ message: "Reaction removed successfully" });
      } else {
        // If different reaction type, update it
        existingReaction.type = type;
        await existingReaction.save();
        return res.json({ message: "Reaction updated successfully" });
      }
    }

    // Create new reaction
    await ArtworkReaction.create({
      user_id: userId,
      artwork_id: artworkId,
      type,
      created_at: new Date(),
    });

    res.json({ message: "Reaction added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get artwork reactions
const getReactions = async (req, res) => {
  try {
    const { artworkId } = req.params;
    const likeCount = await ArtworkReaction.count({
      where: { artwork_id: artworkId },
    });

    res.json({ count: likeCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const checkUserReaction = async (req, res) => {
  try {
    const { artworkId } = req.params;
    const userId = req.user.id;
    const reaction = await ArtworkReaction.findOne({
      where: { artwork_id: artworkId, user_id: userId },
    });
    res.json({ hasReacted: reaction !== null });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Add comment to artwork
const addComment = async (req, res) => {
  try {
    const { artworkId } = req.params;
    const userId = req.user.id;
    const { content } = req.body;

    const comment = await ArtworkComment.create({
      user_id: userId,
      artwork_id: artworkId,
      content,
      created_at: new Date(),
    });

    // Fetch the created comment with user details
    const commentWithUser = await ArtworkComment.findOne({
      where: { id: comment.id },
      include: [
        {
          model: User,
          attributes: ["id", "username"],
        },
      ],
    });

    res.json(commentWithUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get artwork comments
const getComments = async (req, res) => {
  try {
    const { artworkId } = req.params;
    const comments = await ArtworkComment.findAll({
      where: { artwork_id: artworkId },
      include: [
        {
          model: User,
          attributes: ["id", "username"],
        },
      ],
      order: [["created_at", "DESC"]],
    });
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete comment
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    const comment = await ArtworkComment.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if user is the comment owner
    if (comment.user_id !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this comment" });
    }

    await comment.destroy();
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  toggleReaction,
  getReactions,
  checkUserReaction,
  addComment,
  getComments,
  deleteComment,
};
