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

// Public: Get all feedback (read-only for public viewing)
router.get('/feedback/public', feedbackController.getPublicFeedback);

// Protected: Get all feedback (Admin only)
router.get('/feedback', verifyToken, verifyAdmin, feedbackController.getAllFeedback);

// Protected: Get feedback by ID (Admin only)
router.get('/feedback/:id', verifyToken, verifyAdmin, feedbackController.getFeedbackById);

// Protected: Update status (Admin only)
router.patch('/feedback/:id/status', verifyToken, verifyAdmin, feedbackController.updateStatus);

// Protected: Update admin action (Admin only)
router.patch('/feedback/:id/admin-action', verifyToken, verifyAdmin, feedbackController.updateAdminAction);

// Protected: Delete feedback (Admin only)
router.delete('/feedback/:id', verifyToken, verifyAdmin, feedbackController.deleteFeedback);

module.exports = router;

