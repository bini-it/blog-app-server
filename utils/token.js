import bcrypt from "bcryptjs";
import User from "../models/User.js";

/**
 * Add a hashed refresh token to the user's refreshTokens array
 */
export async function addRefreshToken(userId, token) {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const hashed = await bcrypt.hash(token, 10);
  user.refreshTokens.push(hashed);
  await user.save();
}

/**
 * Remove a refresh token from the user's refreshTokens array
 */
export async function removeRefreshToken(userId, token) {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const remainingTokens = [];
  for (const rt of user.refreshTokens) {
    const match = await bcrypt.compare(token, rt);
    if (!match) remainingTokens.push(rt);
  }

  user.refreshTokens = remainingTokens;
  await user.save();
}

export async function isValidRefreshToken(userId, token) {
  const user = await User.findById(userId);
  if (!user) return false;

  for (const rt of user.refreshTokens) {
    const match = await bcrypt.compare(token, rt);
    if (match) return true;
  }
  return false;
}
