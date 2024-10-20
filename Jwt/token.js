import jwt from "jsonwebtoken";
import userModel from "../Models/UserModel.js";

/**
 * Generates a JWT token for the given user ID and sets it as a cookie in the response.
 * 
 * @param {string} userId - The ID of the user.
 * @param {object} res - The HTTP response object.
 * @returns {string} The generated JWT token.
 */
export const jwttoken = async (userId, res) => {
  try {
    const token = jwt.sign({ userId }, process.env.KEY, {
      expiresIn: "1h",
    });

    // Set the secure flag to true in production environments
    const cookieOptions = {
      httpOnly: true,
      path: "/",
      sameSite: "strict",
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
