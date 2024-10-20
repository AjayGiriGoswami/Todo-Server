import jwt from "jsonwebtoken";
import userModel from "../Models/UserModel.js";

export const jwttoken = async (userId, res) => {
  try {
    const token = jwt.sign({ userId }, process.env.KEY, {
      expiresIn: "1d",
    });

    const cookieOptions = {
      httpOnly: true,
   
    };

    res.cookie("jwt", token, cookieOptions);

    // Update the user document with the new token
    await userModel.findByIdAndUpdate(userId, { token });

    return token;
  } catch (error) {
    // Log the error and return a generic error message
    console.error(error);
    return "Error generating JWT token";
  }
};
