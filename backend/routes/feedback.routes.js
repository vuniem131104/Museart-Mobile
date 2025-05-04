const express = require('express');
const router = express.Router();
const { authJwt } = require('../middleware');
const feedbackController = require('../controllers/feedback.controller');

// Submit feedback
// Public route (can be submitted by guests as well)
router.post('/', feedbackController.submitFeedback);

// Get all feedback (admin only)
router.get('/', [authJwt.verifyToken, authJwt.isAdmin], feedbackController.getAllFeedback);

// Get user feedback (user can only see their own feedback)
router.get('/user', [authJwt.verifyToken], feedbackController.getUserFeedback);

module.exports = router; 