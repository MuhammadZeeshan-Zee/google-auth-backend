import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});
import  {sequelize } from "./db/index.js";
import { app } from "./app.js";
app.listen(process.env.PORT || 8000, async () => {
  try {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});