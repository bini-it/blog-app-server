import Blog from "../models/Blog.js";

// =============================
// CREATE BLOG (auth required)

// =============================
export const createBlog = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    if (!title || !content || !category) {
      return res
        .status(400)
        .json({ message: "Title ,content and category are required" });
    }
    const allowedCategories = ["tech", "lifestyle", "education"];
    const normalizedCategory = category.toLowerCase();

    if (!allowedCategories.includes(normalizedCategory)) {
      return res.status(400).json({
        message: "Allowed categories are Tech, Lifestyle, or Education",
      });
    }

    const blog = await Blog.create({
      title,
      content,
      category: normalizedCategory,
      author: req.user.id,
    });

    res.status(201).json({
      message: "Blog created successfully",
      blog,
    });
  } catch (error) {
    console.error("Create Blog Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// =============================
// GET ALL BLOGS (public)
// =============================
// export const getAllBlogs = async (req, res) => {
//   try {
//     const page = Math.max(parseInt(req.query.page) || 1, 1);
//     const limit = Math.min(parseInt(req.query.limit) || 10, 50);
//     const skip = (page - 1) * limit;

//     const [total, blogs] = await Promise.all([
//       Blog.countDocuments(),
//       Blog.find()
//         .populate("author", "email firstName lastName")
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(limit)
//         .lean(),
//     ]);

//     const totalPages = Math.ceil(total / limit);

//     res.status(200).json({
//       blogs,
//       page,
//       limit,
//       total,
//       totalPages,
//       hasNextPage: page < totalPages,
//       hasPrevPage: page > 1,
//     });
//   } catch (error) {
//     console.error("Get Blogs Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

export const getAllBlogs = async (req, res) => {
  try {
    const { page, limit, category } = req.query;

    // 1. Initialize query object
    const filter = {};
    if (category) {
      filter.category = category;
    }

    const currentPage = Math.max(parseInt(page) || 1, 1);
    const currentLimit = Math.min(parseInt(limit) || 10, 50);
    const skip = (currentPage - 1) * currentLimit;

    // 2. Apply filter to both count and find
    const [total, blogs] = await Promise.all([
      Blog.countDocuments(filter), // Counts only filtered items
      Blog.find(filter) // Finds only filtered items
        .populate("author", "email firstName lastName")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(currentLimit)
        .lean(),
    ]);

    const totalPages = Math.ceil(total / currentLimit);

    res.status(200).json({
      blogs,
      page: currentPage,
      limit: currentLimit,
      total,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
    });
  } catch (error) {
    console.error("Get Blogs Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// =============================
// GET SINGLE BLOG (public)
// =============================
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      "author",
      "email firstName lastName"
    );

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    res.status(200).json(blog);
  } catch (error) {
    console.error("Get Blog Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// =============================
// DELETE BLOG (auth + own only)
// =============================
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // check if the blog belongs to the logged-in user
    if (blog.author.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not allowed to delete this blog" });
    }

    await blog.deleteOne();

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Delete Blog Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// =============================
// LIKE BLOG (auth required)
// =============================
export const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.likes.includes(req.user.id)) {
      return res.status(400).json({ message: "Blog already liked" });
    }

    // blog.likes.push(req.user.id);
    // await blog.save();
    await Blog.findByIdAndUpdate(req.params.id, {
      $addToSet: { likes: req.user.id },
    });
    res.status(200).json({ message: "Blog liked", likes: blog.likes.length + 1 });
  } catch (error) {
    console.error("Like Blog Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// =============================
// UNLIKE BLOG (auth required)
// =============================
export const unlikeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (!blog.likes.includes(req.user.id)) {
      return res.status(400).json({ message: "Blog not liked yet" });
    }

    // blog.likes = blog.likes.filter(
    //   (userId) => userId.toString() !== req.user.id
    // );

    await blog.save();
    await Blog.findByIdAndUpdate(req.params.id, {
      $pull: { likes: req.user.id },
    });

    res.status(200).json({ message: "Blog unliked", likes: blog.likes.length - 1 });
  } catch (error) {
    console.error("Unlike Blog Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// =============================
// GET BLOGS CREATED BY LOGGED-IN USER (auth required)
// =============================
export const getMyBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user.id })
      .populate("author", "email firstName lastName")
      .sort({
        createdAt: -1,
      });

    res.status(200).json(blogs);
  } catch (error) {
    console.error("Get My Blogs Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
