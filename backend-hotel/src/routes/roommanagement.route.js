import { Router } from "express";   
import { upload} from "../middlewares/multer.js";
import {
  createRoom,   
    getAllRooms,
    getRoomById,
    updateRoom,
    deleteRoom,
} from "../controller/RoomController.js";
import verifyJWT from "../middleware/authmiddleware.js";
import authorizeRoles from "../middleware/rolemiddleware.js";  
const router = Router();

// All routes are protected and only accessible by admin and manager
router.use(verifyJWT);
router.use(authorizeRoles("admin", "manager"));

router
  .route("/")
  .post(upload.array("images", 5), createRoom)  
  .get(getAllRooms);    

router
    .route("/:id")
    .get(getRoomById)
    .put(upload.array("images", 5), updateRoom)
    .delete(deleteRoom);                    

export default router;