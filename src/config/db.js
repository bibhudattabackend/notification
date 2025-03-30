const { Sequelize } = require("sequelize");
require("dotenv").config(); // Ensure environment variables are loaded
console.log(process.env.DB_NAME);
console.log(process.env.DB_USER);
// Create Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false,
  }
);

module.exports = { sequelize };
