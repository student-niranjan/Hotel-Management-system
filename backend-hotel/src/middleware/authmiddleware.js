import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const verifyjwt = asyncHandler(async (req, res, next) => {

  // 1️⃣ Get token from Cookie OR Authorization header
  const token =
    req.cookies?.accessToken ||
    req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return next(new ApiError(401, "You are not logged in. Token missing."));
  }

  // 2️⃣ Verify the token
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  // 3️⃣ Find the user from DB
  const user = await User.findById(decoded._id).select(
    "-password -refreshToken"
  );

  if (!user) {
    return next(new ApiError(401, "User belonging to token no longer exists."));
  }

  // 4️⃣ Attach user to request
  req.user = user;

  next();
});

export default verifyjwt;


   

