import jwt from "jsonwebtoken";
import userModel from "../Models/UserModel.js";

export const jwttoken = async (userId, res) => {
  const token = await jwt.sign({ userId }, process.env.KEY, {
    expiresIn: "10d",
  });
  res.cookie ("jwt",token ,{
    httpOnly: true,
    secure: false,
    sameSite : "lax",
    path: "/"
  })

  await userModel.findByIdAndUpdate(userId,{token})
  return token
};
