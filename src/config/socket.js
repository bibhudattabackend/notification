const socketIo = require("socket.io");
const { Notification } = require("../models");

let io;
const onlineUsers = new Map(); // Stores { userId: socketId }

const initializeSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("register", async (userId) => {
      onlineUsers.set(userId, socket.id);
      console.log(`User ${userId} registered with socket ${socket.id}`);

      // Fetch unread notifications for the user
      try {
        const pendingNotifications = await Notification.findAll({
          where: { receiverId: userId, isRead: false },
        });

        if (pendingNotifications.length > 0) {
          pendingNotifications.forEach((notif) => {
            io.to(socket.id).emit("new_notification", notif);
          });
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    });

    socket.on("disconnect", () => {
      for (const [userId, id] of onlineUsers.entries()) {
        if (id === socket.id) {
          onlineUsers.delete(userId);
          console.log(`User ${userId} disconnected`);
          break;
        }
      }
    });
  });

  return io;
};

const getIo = () => io;
const getOnlineUsers = () => onlineUsers;

module.exports = { initializeSocket, getIo, getOnlineUsers };
