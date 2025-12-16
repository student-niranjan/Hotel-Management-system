import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import User from "../models/user.model.js";

const generateAccessTokenANdRefreshToken =async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    } else {
      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();

         console.log("Access Token:", accessToken ? "✅ generated" : "❌ missing");
    console.log("Refresh Token:", refreshToken ? "✅ generated" : "❌ missing");

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

      return { accessToken, refreshToken };
    }
  } catch (error) {
    console.error("Error generating tokens:", error);
    throw new ApiError(500, "Failed to generate tokens");
    
  }}

const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
    console.log(req.body);
  if (!name || !email || !password) {
    return next(new ApiError(400, "Username, email, and password are required"));
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new ApiError(400, "User with this email already exists"));
  }

  // Create user
  const user = await User.create({
    name: name.toLowerCase(),
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    throw new ApiError(500, "User creation failed");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, "User registered successfully", createdUser));


});

const loginUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  // At least username or email + password
  if ((!name && !email) || !password) {
    return next(new ApiError(400, "Provide username or email, and password"));
  }

  // Build search query
  const searchQuery = [];
  if (email) searchQuery.push({ email });
  if (name) searchQuery.push({ name: username.toLowerCase() });

  // Find user
  const user = await User.findOne({ $or: searchQuery });

  if (!user) {
    return next(new ApiError(404, "User not found"));
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return next(new ApiError(401, "Invalid password"));
  }

  const{ accessToken, refreshToken } = await generateAccessTokenANdRefreshToken(user._id);
 
  // Remove password from output
  const safeUser = await User.findById(user._id).select("-password");
 
  const options={
    httpOnly:true,
    secure:process.env.NODE_ENV === "production"
  }

  return res.status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json({
    message: "Login successful",
    user: safeUser,accessToken:accessToken,refreshToken:refreshToken
  });
});

const logoutUser = asyncHandler(async (req, res, next) => {

  // 1️⃣ Remove refresh token from DB
  await User.findByIdAndUpdate(
    req.user._id,
    { $set: { refreshToken: null } },
    { new: true }
  );

  // 2️⃣ Cookie options
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production"
  };

  // 3️⃣ Clear cookies + send response
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({
      message: "Logout successful",
      success: true
    });
});

// create the  owner
 const createOwner = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body; 
  if (!username || !email || !password) {
    return next(new ApiError(400, "Username, email, and password are required"));
  } 
  const userExists = await User.findOne({ email }); 
  if (userExists) {
    return next(new ApiError(400, "User with this email already exists"));
  }
  // Create user
  const user = await User.create({
    name: username.toLowerCase(),   
    email,
    password,
    role: 'owner'       
  });
  const createdUser = await User.findById(user._id).select("-password");
  if (!createdUser) {
    throw new ApiError(500, "User creation failed");
  }
  return res
    .status(201)
    .json(new ApiResponse(201, "Owner registered successfully", createdUser));
}); 

// update password and username
 const updateUserProfile = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;  
  const user = await User.findById(req.user._id); 
  if (!user) {
    return next(new ApiError(404, "User not found"));
  }   
  if (username) user.name = username.toLowerCase();
  if (password) user.password = password; 
  await user.save();
  const updatedUser = await User.findById(user._id).select("-password");  
  return res
    .status(200)
    .json(new ApiResponse(200, "User profile updated successfully", updatedUser));
});

// if user forgot password
 const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;   
  if (!email) {
    return next(new ApiError(400, "Email is required"));
  }
  const user = await User.findOne({ email }); 
  if (!user) {
    return next(new ApiError(404, "User with this email does not exist"));
  }   
  // Here, you would typically generate a reset token and send an email.
  return res
    .status(200)
    .json(new ApiResponse(200, "Password reset link sent to email (simulated)", null));
});


//create  staff 
  const createStaff = asyncHandler(async (req, res, next) => {      
  const { username, email, password } = req.body; 
  if (!username || !email || !password) {
    return next(new ApiError(400, "Username, email, and password are required"));
  }
  const userExists = await User.findOne({ email }); 
  if (userExists) {
    return next(new ApiError(400, "User with this email already exists"));
  }
  // Create user
  const user = await User.create({
    name: username.toLowerCase(),   
    email,
    password,
    role: 'staff'
  });
  const createdUser = await User.findById(user._id).select("-password");  
  if (!createdUser) {
    throw new ApiError(500, "User creation failed");
  }   
  return res
    .status(201)
    .json(new ApiResponse(201, "Staff registered successfully", createdUser));
}); 



export { registerUser, loginUser ,logoutUser, createOwner, updateUserProfile, forgotPassword, createStaff };
