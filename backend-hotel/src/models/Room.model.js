import mongoose, { Schema } from "mongoose";

const roomSchema = new Schema(
  {
    roomNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    type: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
       enum: ["available", "booked", "occupied", "cleaning", "maintenance"],
       default: "available",
        },

    images: [
      {
        public_id: String,
        url: String,
      },
    ],

    description: {
      type: String,
      trim: true,
    },

    amenities: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);
export default Room;
