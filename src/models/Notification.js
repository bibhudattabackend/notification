const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db"); // ✅ Use single instance
const User = require("./User"); // ✅ Import User after sequelize instance

const Notification = sequelize.define(
  "Notification",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    message: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

// Define Relationships
Notification.belongsTo(User, { foreignKey: "senderId", as: "sender" });
Notification.belongsTo(User, { foreignKey: "receiverId", as: "receiver" });

module.exports = Notification;
