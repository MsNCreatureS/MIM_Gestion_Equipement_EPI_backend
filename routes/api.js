const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const authController = require('../controllers/authController');
const feedbackController = require('../controllers/feedbackController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Type de fichier non autorisé'));
    }
});

// Auth Routes
router.post('/login', authController.login);

// Feedback Routes
// Public: Submit feedback with file uploads (max 10 files)
router.post('/feedback', upload.array('files', 10), feedbackController.submitFeedback);

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

const typeController = require('../controllers/typeController');

// Problem Types Routes
// Public: Get active types for the form
router.get('/types', typeController.getAllTypes);

// Protected: Get all types for admin (including inactive)
router.get('/admin/types', verifyToken, verifyAdmin, typeController.getAdminTypes);

// Protected: Create type
router.post('/admin/types', verifyToken, verifyAdmin, typeController.createType);

// Protected: Update type
router.patch('/admin/types/:id', verifyToken, verifyAdmin, typeController.updateType);

// Protected: Delete type
router.delete('/admin/types/:id', verifyToken, verifyAdmin, typeController.deleteType);

// Email Recipients Routes (Admin only)
const emailController = require('../controllers/emailController');

router.get('/admin/emails', verifyToken, verifyAdmin, emailController.getRecipients);
router.post('/admin/emails', verifyToken, verifyAdmin, emailController.addRecipient);
router.delete('/admin/emails/:id', verifyToken, verifyAdmin, emailController.deleteRecipient);


module.exports = router;
