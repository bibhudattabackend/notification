const Notification = require("../models/Notification");
const { getIo, getOnlineUsers } = require("../config/socket");
const { User } = require("../models");
const { Op } = require('sequelize'); 
const jwt = require('jsonwebtoken')
module.exports = {
    //  Send Notification
    sendNotification: async (req, res) => {
        try {
            const { receiverId, message } = req.body;
            const token = req.cookies.auth_token; // Get JWT token from cookie
            if (!token) {
                return res.status(401).json({ error: "User not authenticated" });
            }
    
            // Verify and decode JWT
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const senderId = decoded.userId;
            // Create a new notification
            const notification = await Notification.create({
                senderId,
                receiverId,
                message,
            });

            // Get online users
            const ioInstance = getIo();
            const onlineUsers = getOnlineUsers();
            const socketId = onlineUsers.get(receiverId);

            if (ioInstance && socketId) {
                console.log(`Sending notification to ${socketId}`);
                ioInstance.to(socketId).emit("new_notification", notification);
            }

            res.status(201).json(notification);
        } catch (err) {
            console.error("Notification error:", err);
            res.status(500).json({ error: err.message });
        }
    },

    //  Get All Notifications for a User
    getNotifications: async (req, res) => {
        try {
            const token = req.cookies.auth_token; // Get JWT token from cookie
            if (!token) {
                return res.status(401).json({ error: "User not authenticated" });
            }
    
            // Verify and decode JWT
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.userId;
            const notifications = await Notification.findAll({
                where: { receiverId: userId },
                order: [["createdAt", "DESC"]],
            });

            res.json(notifications);
        } catch (err) {
            console.error("Fetch error:", err);
            res.status(500).json({ error: "Failed to fetch notifications" });
        }
    },

    //  Mark a Notification as Read
    markAsRead: async (req, res) => {
        try {
            const notificationId = req.params.id;
            const token = req.cookies.auth_token; // Get JWT token from cookie
            if (!token) {
                return res.status(401).json({ error: "User not authenticated" });
            }
    
            // Verify and decode JWT
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.userId;
            // Update the notification status
            const updatedNotification = await Notification.update(
                { isRead: true },
                { where: { id: notificationId, receiverId: userId } }
            );

            if (updatedNotification[0] === 0) {
                return res.status(404).json({ error: "Notification not found or not authorized" });
            }

            const notification = await Notification.findOne({ where: { id: notificationId } });
            const senderId = notification.senderId;
            const receiver = await User.findOne({ where: { id: userId }, attributes: ["username"] });

            if (!receiver) {
                return res.status(404).json({ error: "Receiver not found" });
            }
            console.log('senderId', senderId, notification);
            // Get online users
            const ioInstance = getIo();
            const onlineUsers = getOnlineUsers();
            const senderSocketId = onlineUsers.get(String(senderId));
            console.log('senderSocketId', senderSocketId, onlineUsers);
            if (ioInstance && senderSocketId) {
                // ioInstance.to(senderSocketId).emit("message_read", notification);
                ioInstance.to(senderSocketId).emit("message_read", {
                    notificationId,
                    senderId,
                    receiverId: userId,
                    message: `${receiver.username} has read your message: ${notification.message}.`,
                });
            }

            res.status(200).json({ message: "Notification marked as read" });
        } catch (err) {
            console.error("Mark read error:", err);
            res.status(500).json({ error: "Failed to update notification" });
        }
    },
    markAllAsRead: async (req, res) => {
        try {
            const token = req.cookies.auth_token; // Get JWT token from cookie
            if (!token) {
                return res.status(401).json({ error: "User not authenticated" });
            }
    
            // Verify and decode JWT
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.userId;
    
            // Mark all unread notifications as read
            const updatedNotifications = await Notification.update(
                { isRead: true },
                { where: { receiverId: userId, isRead: false } }
            );
    
            if (updatedNotifications[0] === 0) {
                return res.status(404).json({ error: "No unread notifications found" });
            }
    
            res.status(200).json({ message: "All notifications marked as read" });
        } catch (err) {
            console.error("Mark all as read error:", err);
            res.status(500).json({ error: "Failed to update notifications" });
        }
    },
    
    deleteAllRead: async (req, res) => {
        try {
            const token = req.cookies.auth_token; // Get JWT token from cookie
            if (!token) {
                return res.status(401).json({ error: "User not authenticated" });
            }
    
            // Verify and decode JWT
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.userId;
    
            // Delete all read notifications
            const deletedCount = await Notification.destroy({
                where: { receiverId: userId, isRead: true }
            });
    
            if (deletedCount === 0) {
                return res.status(404).json({ error: "No read notifications found" });
            }
    
            res.status(200).json({ message: "All read notifications deleted" });
        } catch (err) {
            console.error("Delete all read error:", err);
            res.status(500).json({ error: "Failed to delete notifications" });
        }
    },
        
    findAllUser: async (req, res) => {
        try {
            const token = req.cookies.auth_token; // Get JWT token from cookie
        if (!token) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        // Verify and decode JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const loggedInUserId = decoded.userId; // Extract user ID from cookies
    console.log('hahahah',loggedInUserId)
            if (!loggedInUserId) {
                return res.status(401).json({ error: 'User not authenticated' });
            }
    
            const users = await User.findAll({
                attributes: ['id', 'username'],
                where: {
                    id: { [Op.ne]: loggedInUserId } // Exclude the logged-in user
                }
            });
    
            res.status(200).json(users);
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ error: 'Failed to fetch users' });
        }
    }
};
