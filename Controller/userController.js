import userModel from "../Models/UserModel.js";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { jwttoken } from "../Jwt/token.js";
import stringifySafe from "json-stringify-safe"

export const userSchema = z.object({
  name: z.string().min(3, { message: "Nam Must be 3 or more characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(4, { message: "Password Must be $ or more characters long" }),
});

export const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(4, { message: "Password Must be 4 or more characters long" }),
});

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All Fields are Required",
      });
    }

    const validation = userSchema.safeParse({ name, email, password });
    if (!validation.success) {
      const errorMessages = validation.error.errors.reduce((acc, err) => {
        acc[err.path[0]] = err.message;
        return acc;
      }, {});
      return res.status(400).json({
        errors: errorMessages,
      });
    }
    const preuser = await userModel.findOne({ email: email });
    if (preuser) {
      return res.status(400).json({
        message: "User is Already Existed",
      });
    }
    const hashpassword = await bcrypt.hash(password, 10);
    const newuser = await userModel.create({
      name,
      email,
      password: hashpassword,
    });
    const token = await jwttoken(newuser._id, res);
    return res.status(200).json({
      message: "Account Created Successfully!",
      newuser,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "All Fields are Required",
      });
    }

    const validation = LoginSchema.safeParse({ email, password });
    if (!validation.success) {
      const errprint = validation.error.errors.map((err) => err.message);
      return res.status(400).json({
        errors: errprint,
      });
    }

    const preuser = await userModel.findOne({ email });
    if (!preuser) {
      return res.status(400).json({
        message: "User is Not Exited",
      });
    }
    const hashpassword = await bcrypt.compare(password, preuser.password);
    if (!hashpassword) {
      return res.status(400).json({
        message: "Wrong Password",
      });
    }
    
    const token = await jwttoken(preuser._id, res);
    return res.status(200).json({
      message: "Login Successful",
      preuser,
      token
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      path: "/",
    });
    return res.status(200).json({
      message: "Logout Successfully!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
