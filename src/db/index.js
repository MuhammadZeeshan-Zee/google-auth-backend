import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

console.log("name",process.env.DB_NAME,);

export const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: "mysql",
  // logging: false, // Disable logging (optional)
});


