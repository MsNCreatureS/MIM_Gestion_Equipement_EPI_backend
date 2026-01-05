const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const feedbackController = require('../controllers/feedbackController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// Auth Routes
router.post('/login', authController.login);

// Feedback Routes
// Public: Submit feedback
router.post('/feedback', feedbackController.submitFeedback);

// Protected: Get all feedback (Admin only)
router.get('/feedback', verifyToken, verifyAdmin, feedbackController.getAllFeedback);

// Protected: Update status (Admin only)
router.patch('/feedback/:id/status', verifyToken, verifyAdmin, feedbackController.updateStatus);

// Protected: Delete feedback (Admin only)
router.delete('/feedback/:id', verifyToken, verifyAdmin, feedbackController.deleteFeedback);

module.exports = router;
