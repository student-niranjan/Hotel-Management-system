import { 
  registerUser,
  loginUser,
  createOwner,
  createStaff,
  updateUserProfile,
  forgotPassword
} from '../controller/usercontroller.js';

import { Router } from 'express';
import verifyJWT from "../middleware/authmiddleware.js";
import authorizeRoles from "../middleware/rolemiddleware.js";

const router = Router();

// Public Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);  

// OWNER creates ADMIN
router.post(
  "/create-owner",
  verifyJWT,
  authorizeRoles("owner"),   // only owner
  createOwner
);

// OWNER + ADMIN create STAFF
router.post(
  "/create-staff",
  verifyJWT,
  authorizeRoles("owner", "admin"),
  createStaff
);

// USER / ADMIN / OWNER can update their own profile
router.put(
  "/update-profile",
  verifyJWT,
  authorizeRoles("user", "admin", "owner"),
  updateUserProfile
);

// Example Dashboard Routes

// Only admin
router.get(
  "/admin-dashboard",
  verifyJWT,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({ message: "Welcome Admin" });
  }
);

// Owner + Admin
router.get(
  "/manage-users",
  verifyJWT,
  authorizeRoles("owner", "admin"),
  (req, res) => {
    res.json({ message: "This is for Owner & Admin" });
  }
);

// User/Admin/Owner
router.get(
  "/user-profile",
  verifyJWT,
  authorizeRoles("user", "admin", "owner"),
  (req, res) => {
    res.json({ message: "User Profile Accessed" });
  }
);

export default router;
