const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const notificationController = require('../controllers/notificationController');

router.post('/send', authMiddleware, notificationController.sendNotification);
router.get('/', authMiddleware, notificationController.getNotifications);
router.put('/:id/read', authMiddleware, notificationController.markAsRead);
router.get('/users', authMiddleware, notificationController.findAllUser);
// Mark all notifications as read
router.put("/mark-all-read", notificationController.markAllAsRead);

// Delete all read notifications
router.delete("/delete-all-read", notificationController.deleteAllRead);
module.exports = router;