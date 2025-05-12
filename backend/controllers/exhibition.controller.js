const {
  Exhibition,
  ExhibitionReaction,
  ExhibitionComment,
  User,
} = require("../models/models");
const sequelize = require("../models/config.models");

// Like/Unlike exhibition
const toggleReaction = async (req, res) => {
  try {
    const { exhibitionId } = req.params;
    const userId = req.userId;
    const { type } = req.body || "like";

    const existingReaction = await ExhibitionReaction.findOne({
      where: {
        user_id: userId,
        exhibition_id: exhibitionId,
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
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
    await ExhibitionReaction.create({
      user_id: userId,
      exhibition_id: exhibitionId,
      type,
      created_at: new Date(),
    });

    res.json({ message: "Reaction added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get exhibition reactions
const getReactions = async (req, res) => {
  try {
    const { exhibitionId } = req.params;
    const reactions = await ExhibitionReaction.count({
      where: { exhibition_id: exhibitionId },
    });
    res.json({ count: reactions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const checkUserReaction = async (req, res) => {
  try {
    const { exhibitionId } = req.params;
    const userId = req.userId;
    const reaction = await ExhibitionReaction.findOne({
      where: { exhibition_id: exhibitionId, user_id: userId },
    });
    res.json({ hasReacted: reaction !== null });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Add comment to exhibition
const addComment = async (req, res) => {
  try {
    const { exhibitionId } = req.params;
    const userId = req.userId;
    const { content } = req.body;

    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
    const comment = await ExhibitionComment.create({
      user_id: userId,
      exhibition_id: exhibitionId,
      content,
      created_at: new Date(),
    });

    res.json({ message: "Comment added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get exhibition comments
const getComments = async (req, res) => {
  try {
    const { exhibitionId } = req.params;
    const comments = await ExhibitionComment.findAll({
      where: { exhibition_id: exhibitionId },
      attributes: ["id", "content", "created_at"],
      include: [
        {
          model: User,
          attributes: ["username"],
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
    const userId = req.userId;

    const comment = await ExhibitionComment.findOne({
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
