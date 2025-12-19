import jwt from "jsonwebtoken";

export const generateAccessToken = (userId) =>
  jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });

// export const verifyAccessToken = (token) =>
//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
