import jwt from "jsonwebtoken";
import userModel from "../Models/UserModel.js";

export const authication = async (req, res, next) => {
  const token = req.cookies.jwt;

  // Check if token is present and valid
  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  // Verify token and get user details
  try {
    const decode = jwt.verify(token, process.env.KEY);

    req.user = await userModel.findById(decode.userId);
  } catch (error) {
    console.log(error);
    return res.status(403).json({
      message: error.message,
    });
  }
  next();
};
