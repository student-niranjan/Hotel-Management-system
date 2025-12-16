import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/connection.js";

dotenv.config();

connectDB();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
