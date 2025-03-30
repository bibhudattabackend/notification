const { sequelize } = require("../config/db");
const User = require("./User");
const Notification = require("./Notification");

// Sync models with database
sequelize.sync({ alter: true }) // ⚠️ Set `{ force: true }` ONLY in development
  .then(() => console.log("✅ Database & tables synced"))
  .catch((err) => console.error("❌ Error syncing database:", err));

module.exports = {
  sequelize,
  User,
  Notification,
};
