import express from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getUsers); // Read all
router.get("/:id", getUserById); // Read single
router.put("/:id", updateUser); // Update
router.delete("/:id", deleteUser); // Delete

export default router;
