import { DataTypes } from "sequelize";
import {sequelize} from "../db/index.js";

const User = sequelize.define("User", {
  id: {
    type: DataTypes.STRING, // Google ID (sub) will be used as primary key
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  picture: {
    type: DataTypes.STRING,
  },
  accessToken: {
    type: DataTypes.TEXT, // Store JWT access token
  },
  refreshToken: {
    type: DataTypes.TEXT, // Store JWT refresh token
  },
},{
  timestamps: false, // ✅ Disable createdAt and updatedAt
  tableName: "User", // ✅ Ensure table name matches the database table
});
export default User;
