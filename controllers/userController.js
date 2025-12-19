import User from "../models/User.js";
import Blog from "../models/Blog.js";
import bcrypt from "bcryptjs";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -refreshTokens");
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "-password -refreshTokens"
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { email, password, firstName, lastName, age, bio, phone, address } =
      req.body;

    const updateData = {};

    if (email) updateData.email = email;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (age) updateData.age = age;
    if (bio) updateData.bio = bio;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select("-password -refreshTokens");

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // 1. Delete the user
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser)
      return res.status(404).json({ message: "User not found" });

    // 2. Delete all blogs authored by this user
    await Blog.deleteMany({ author: userId });

    // 3. Remove their likes from all blogs
    await Blog.updateMany(
      { likes: userId },
      { $pull: { likes: userId } }
    );

    res.status(200).json({
      message: "User deleted, their blogs removed, and likes cleared.",
    });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};