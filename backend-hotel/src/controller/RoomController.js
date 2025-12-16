import Room from "../models/Room.model";
import asyncHandler from "express-async-handler";
import  ApiError  from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";  
import {uploadRoomImages,deleteImage} from "../utils/Cloudinary.js";

const createRoom = asyncHandler(async (req, res) => {
  const { roomNumber, type, price, amenities, status } = req.body;  
    if (![roomNumber, type, price]) {   
    throw new ApiError(400, "Room number, type, and price are required");
  }     
    const room = new Room({
    roomNumber,
    type,               
    price,
    amenities,
    status,                 
    });
    await room.save();
    res.status(201).json(new ApiResponse(201, "Room created successfully", room));
});
  
// image upload logic can be added here as needed

const imagesupload = asyncHandler(async(req,res,next) => {      
    const room = await Room.findById(req.params.id);
    if(!room){
        throw new ApiError (404,"Room not found");
    }   
    if(!req.files || req.files.length ===0)
        {
        return next();
    }   

    const imageUrls = [];
    for(const file of req.files){
        const uploadResult = await uploadRoomImages(file.path);
        imageUrls.push(uploadResult);       
    }

    room.images = room.images.concat(imageUrls);
    await room.save();
    res.status(200).json(new ApiResponse(200,"Images uploaded successfully",room));
}); 

const deleteRoomImages = asyncHandler(async(req,res,next) => {
    const room = await Room.findById(req.params.id);        
    if(!room){
        throw new ApiError (404,"Room not found");
    }   
    const {public_ids} = req.body; // Expecting an array of public_ids to delete
    if(!public_ids || !Array.isArray(public_ids) || public_ids.length ===0){
        return next();
    }

    for(const public_id of public_ids){                 
        await deleteImage (public_id);
        room.images = room.images.filter(img => img.public_id !== public_id);
    }                                       
    await room.save();
    res.status(200).json (new ApiResponse(200,"Images deleted successfully",room));
});                 
                

  
// Get all rooms
const getAllRooms = asyncHandler(async (req, res) => {
  const rooms = await Room.find();
  res.status(200).json(new ApiResponse(200, "Rooms retrieved successfully", rooms));
});         
// Get a single room by ID
const getRoomById = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);      
    if (!room) {    
    throw new ApiError(404, "Room not found");
  }
    res.status(200).json(new ApiResponse(200, "Room retrieved successfully", room));
});              
// Update a room by ID
const updateRoom = asyncHandler(async (req, res) => {
  const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });  
    if (!room) {     
    throw new ApiError(404, "Room not found");
    }       
    res.status(200).json(new ApiResponse(200, "Room updated successfully", room));
});
// Delete a room by ID
const deleteRoom = asyncHandler(async (req, res) => {
  const room = await Room.findByIdAndDelete(req.params.id);   
    if (!room) {     
    throw new ApiError(404, "Room not found");
    }   
    res.status(200).json(new ApiResponse(200, "Room deleted successfully", room));
});   

// Allowed room status values
const ALLOWED_ROOM_STATUS = [
  "available",
  "booked",
  "occupied",
  "cleaning",
  "maintenance",
];

// Update room status
const updateRoomStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  // Validation
  if (!ALLOWED_ROOM_STATUS.includes(status)) {
    throw new ApiError(400, "Invalid room status");
  }

  // Find room
  const room = await Room.findById(req.params.id);
  if (!room) {
    throw new ApiError(404, "Room not found"); 
  }

  // Update
  room.status = status;
  await room.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Room status updated successfully", room));
});



export {
  createRoom,
  getAllRooms,      
    getRoomById,            
    updateRoom, 
    deleteRoom, 
    imagesupload,
    deleteRoomImages
 ,updateRoomStatus
};  
