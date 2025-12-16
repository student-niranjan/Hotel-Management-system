import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Middlewares
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// Routes
import myrouter from "./routes/user.route.js"; // <-- Must match filename
import bookingRouter from "./routes/Booking.route.js";    
app.use("/api/v1/bookings", bookingRouter); 
app.use("/api/v1/users", myrouter);

export default app;
