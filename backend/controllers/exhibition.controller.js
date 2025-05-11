const {
  Exhibition,
  ExhibitionReaction,
  ExhibitionComment,
  User,
} = require("../models/models");

// Like/Unlike exhibition
const toggleReaction = async (req, res) => {
  try {
    const { exhibitionId } = req.params;
    const userId = req.user.id;
    const { type } = req.body;

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
    const reactions = await ExhibitionReaction.findAll({
      where: { exhibition_id: exhibitionId },
      include: [
        {
          model: User,
          attributes: ["id", "username"],
        },
      ],
    });
    res.json(reactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Add comment to exhibition
const addComment = async (req, res) => {
  try {
    const { exhibitionId } = req.params;
    const userId = req.user.id;
    const { content } = req.body;

    const comment = await ExhibitionComment.create({
      user_id: userId,
      exhibition_id: exhibitionId,
      content,
      created_at: new Date(),
    });

    // Fetch the created comment with user details
    const commentWithUser = await ExhibitionComment.findOne({
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

// Get exhibition comments
const getComments = async (req, res) => {
  try {
    const { exhibitionId } = req.params;
    const comments = await ExhibitionComment.findAll({
      where: { exhibition_id: exhibitionId },
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
  addComment,
  getComments,
  deleteComment,
};
