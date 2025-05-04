const { Feedback } = require('../models/models');

// Submit feedback
exports.submitFeedback = async (req, res) => {
  try {
    const { content, rating } = req.body;
    
    // Validate input
    if (!content) {
      return res.status(400).json({ message: "Feedback content is required" });
    }
    
    // Create feedback object
    const feedbackData = {
      content,
      rating: rating || null,
      user_id: req.userId || null // If user is logged in, userId will be set by auth middleware
    };
    
    // Save feedback
    const feedback = await Feedback.create(feedbackData);
    
    return res.status(201).json({ 
      success: true,
      message: "Feedback submitted successfully",
      data: feedback
    });
    
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return res.status(500).json({ 
      success: false,
      message: "An error occurred while submitting feedback" 
    });
  }
};

// Get all feedback (admin only)
exports.getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findAll({
      order: [['created_at', 'DESC']]
    });
    
    return res.status(200).json({
      success: true,
      data: feedback
    });
    
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return res.status(500).json({ 
      success: false,
      message: "An error occurred while fetching feedback" 
    });
  }
};

// Get user feedback (user can only see their own feedback)
exports.getUserFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findAll({
      where: { user_id: req.userId },
      order: [['created_at', 'DESC']]
    });
    
    return res.status(200).json({
      success: true,
      data: feedback
    });
    
  } catch (error) {
    console.error("Error fetching user feedback:", error);
    return res.status(500).json({ 
      success: false,
      message: "An error occurred while fetching user feedback" 
    });
  }
}; 