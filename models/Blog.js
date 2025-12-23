import { Schema, model } from "mongoose";

const blogSchema = new Schema(
  {
    title: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    category: {
      type: String,
      enum: ["tech", "lifestyle", "education"],
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export default model("Blog", blogSchema);
