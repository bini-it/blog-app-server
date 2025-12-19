import express from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  deleteBlog,
  likeBlog,
  unlikeBlog,
  getMyBlogs,
} from "../controllers/blogController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/my-blogs", authMiddleware, getMyBlogs);
// public
router.get("/", getAllBlogs);
router.get("/:id", getBlogById);

// authenticated only
router.post("/", authMiddleware, createBlog);
router.delete("/:id", authMiddleware, deleteBlog);

router.post("/:id/like", authMiddleware, likeBlog);
router.post("/:id/unlike", authMiddleware, unlikeBlog);


export default router;
