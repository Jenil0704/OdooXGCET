const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate, authorizeHR } = require('../middleware/auth.middleware');

// Public routes
router.post('/login', authController.login);
router.post('/register-hr', authController.registerHR); // Initial HR setup (public for first HR user)

// Protected routes - require authentication
router.get('/me', authenticate, authController.getCurrentUser);
router.post('/change-password', authenticate, authController.changePassword);

// HR only routes - require authentication and HR role
router.post('/register-employee', authenticate, authorizeHR, authController.registerEmployee);

module.exports = router;

