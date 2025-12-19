import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    firstName: { type: String },
    lastName: { type: String },
    age: { type: Number },
    bio: { type: String },
    phone: { type: String },
    address: { type: String },

    refreshTokens: [String],
  },
  { timestamps: true }
);

export default model("User", userSchema);
