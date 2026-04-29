import express from "express";
import { addAddress ,getMyAddresses,deleteAddress} from "../controllers/addressController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", authMiddleware, addAddress);
router.get("/my", authMiddleware, getMyAddresses);
router.delete("/:id", authMiddleware, deleteAddress);
export default router;