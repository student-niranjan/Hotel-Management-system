import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connection.js";

dotenv.config();
const app = express();
connectDB();

app.get("/", (req, res) => {
    res.send("Restaurant Management System API is running");
}); 
const PORT = process.env.PORT || 5000;  
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})