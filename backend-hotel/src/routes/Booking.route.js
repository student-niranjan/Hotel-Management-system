import { Router } from "express";
import {
  searchAvailableRooms,
  createBooking,
  confirmBooking,
  checkInBooking,
  checkOutBooking,
  getAllBookings,
  getAllRoomsStatuses,
  getUserBookings,
} from "../controller/BookingController.js";

import verifyJWT from "../middleware/authmiddleware.js";
import authorizeRoles from "../middleware/rolemiddleware.js";

const routers = Router();

// All routes protected (admin + owner)
routers.use(verifyJWT);
routers.use(authorizeRoles("admin", "owner"));

// -----------------------------------------------------
// GET all bookings / CREATE booking
// -----------------------------------------------------
routers
  .route("/")
  .post(createBooking)
  .get(getAllBookings);

// -----------------------------------------------------
// SEARCH available rooms
// -----------------------------------------------------
routers.get("/search", searchAvailableRooms);

// -----------------------------------------------------
// USER booking history
// -----------------------------------------------------
routers.get("/user/:userId", getUserBookings);

// -----------------------------------------------------
// CONFIRM a booking
// -----------------------------------------------------
routers.put("/:id/confirm", confirmBooking);

// -----------------------------------------------------
// CHECK-IN
// -----------------------------------------------------
routers.put("/:id/checkin", checkInBooking);

// -----------------------------------------------------
// CHECK-OUT
// -----------------------------------------------------
routers.put("/:id/checkout", checkOutBooking);

// -----------------------------------------------------
// GET all room statuses
// -----------------------------------------------------
routers.get("/rooms/status", getAllRoomsStatuses);

export default routers;
