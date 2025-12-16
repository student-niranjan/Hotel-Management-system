import Booking from "../models/Booking.model.js";
import Room from "../models/Room.model.js";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";

// -----------------------------------------------------
// USER: Search Available Rooms
// -----------------------------------------------------
const searchAvailableRooms = asyncHandler(async (req, res) => {
  const { checkIn, checkOut } = req.query;
  if (!checkIn || !checkOut) throw new ApiError(400, "checkIn and checkOut required");

  const rooms = await Room.find();
  const availableRooms = [];

  for (const room of rooms) {
    const overlappingBooking = await Booking.findOne({
      roomId: room._id,
      status: { $in: ["Pending", "Confirmed"] },
      $or: [
        { checkIn: { $lt: new Date(checkOut), $gte: new Date(checkIn) } },
        { checkOut: { $gt: new Date(checkIn), $lte: new Date(checkOut) } },
        { checkIn: { $lte: new Date(checkIn) }, checkOut: { $gte: new Date(checkOut) } },
      ],
    });

    if (!overlappingBooking) availableRooms.push(room);
  }

  res.status(200).json(new ApiResponse(200, "Available rooms retrieved", availableRooms));
});

// -----------------------------------------------------
// USER: Create Booking
// -----------------------------------------------------
const createBooking = asyncHandler(async (req, res) => {
  const { userId, roomId, checkIn, checkOut, totalAmount, paymentStatus } = req.body;

  if (!userId || !roomId || !checkIn || !checkOut || !totalAmount)
    throw new ApiError(400, "All fields are required");

  const overlappingBooking = await Booking.findOne({
    roomId,
    status: { $in: ["Pending", "Confirmed"] },
    $or: [
      { checkIn: { $lt: new Date(checkOut), $gte: new Date(checkIn) } },
      { checkOut: { $gt: new Date(checkIn), $lte: new Date(checkOut) } },
      { checkIn: { $lte: new Date(checkIn) }, checkOut: { $gte: new Date(checkOut) } },
    ],
  });

  if (overlappingBooking) throw new ApiError(400, "Room unavailable for those dates");

  const booking = await Booking.create({
    userId,
    roomId,
    checkIn,
    checkOut,
    totalAmount,
    status: "Pending",
    paymentStatus: paymentStatus || "Pending",
  });

  res.status(201).json(new ApiResponse(201, "Booking created", booking));
});

// -----------------------------------------------------
// STAFF: Confirm Booking
// -----------------------------------------------------
const confirmBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new ApiError(404, "Booking not found");

  if (booking.status === "Confirmed")
    throw new ApiError(400, "Already confirmed");

  booking.status = "Confirmed";
  await booking.save();

  res.status(200).json(new ApiResponse(200, "Booking confirmed", booking));
});

// -----------------------------------------------------
// STAFF: Check-In
// -----------------------------------------------------
const checkInBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new ApiError(404, "Booking not found");

  if (booking.status !== "Confirmed")
    throw new ApiError(400, "Booking must be confirmed before check-in");

  const room = await Room.findById(booking.roomId);
  room.status = "Booked";
  await room.save();

  res.status(200).json(new ApiResponse(200, "Check-in successful", booking));
});

// -----------------------------------------------------
// STAFF: Check-Out
// -----------------------------------------------------
const checkOutBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new ApiError(404, "Booking not found");

  booking.status = "Completed";
  await booking.save();

  const room = await Room.findById(booking.roomId);
  room.status = "Cleaning"; // after checkout → cleaning
  await room.save();

  res.status(200).json(new ApiResponse(200, "Check-out successful", booking));
});


// -----------------------------------------------------
// STAFF: Get All Bookings
// -----------------------------------------------------
const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find()
    .populate("userId", "name email")
    .populate("roomId", "name number type")
    .sort({ checkIn: -1 });

  res.status(200).json(new ApiResponse(200, "All bookings retrieved", bookings));
});

// -----------------------------------------------------
// STAFF: Get All Rooms Status
// -----------------------------------------------------
const getAllRoomsStatuses = asyncHandler(async (req, res) => {
  const rooms = await Room.find({}, "name number type status");

  res.status(200).json(new ApiResponse(200, "All room statuses", rooms));
});

// -----------------------------------------------------
// USER: Booking History
// -----------------------------------------------------
const getUserBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ userId: req.params.userId })
    .populate("roomId", "name number type")
    .sort({ checkIn: -1 });

  res.status(200).json(new ApiResponse(200, "User booking history", bookings));
});

export {
  searchAvailableRooms,
  createBooking,
  confirmBooking,
  checkInBooking,
  checkOutBooking,
  getAllBookings,
  getAllRoomsStatuses,
  getUserBookings,
};
