// authorizeRoles.js
// --------------------------------------------------
// ROLE-BASED AUTHORIZATION MIDDLEWARE (WITH asyncHandler)
// --------------------------------------------------

import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const authorizeRoles = (...allowedRoles) =>
  asyncHandler(async (req, res, next) => {

    // req.user is set in verifyJWT middleware
    if (!req.user) {
      return next(new ApiError(401, "User not authenticated"));
    }

    // Check if the user's role is included in allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(403, "You do not have permission to access this resource")
      );
    }

    // If role is valid → continue
    next();
  });

export default authorizeRoles;
