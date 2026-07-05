import User from "../model/userModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import { genToken ,genToken1 } from "../config/token.js";



export const registration =    async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    if(!validator.isEmail(email)){
      return res.status(400).json({ message: "Enter a valid email " });
    }
    if(password.length < 8){
      return res.status(400).json({ message: "Password must be at least 8 --Suggest Strong Password" });
    }
    let hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashPassword
    });
    let token = await genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000 
    })
    return res.status(201).json(user)
  } catch (error) {
    console.log("registration Error");
    return res.status(500).json({message:`registration error ${error}`})
  }
}

export const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Invalid email or password--user not found" });
    }
    let isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "email or password--password mismatch" });
    }
    let token = await genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000 
    })
    return res.status(201).json({message:"Login successful", user})
  } catch (error) {
    console.log("login Error");
    return res.status(500).json({message:`login error ${error}`})
  }
}

export const logout = async (req, res) => {
  try {
    res.clearCookie("token")
    return res.status(200).json({message:"Logout successful"})
  } catch (error) {
    console.log("logout Error");
    return res.status(500).json({message:`logout error ${error}`})
  }
}


export const googlelogin = async (req, res) => {
  try {
    let { name, email } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
     user = await User.create({
        name,
        email,
      });
    }
    
    let token = await genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000 
    })
    return res.status(200).json(user)
  } catch (error) {
    console.log("Google Login Error");
    return res.status(500).json({message:`Google login error ${error}`})
  }
}

export const adminLogin = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    let token = await genToken1(email);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1 * 24 * 60 * 60 * 1000 
    })
    return res.status(200).json({message:"Admin login successful", token})
    }
      return res.status(401).json({ message: "Invalid admin credentials" });
  } catch (error) {
    console.log("Admin Login Error");
    return res.status(500).json({message:`Admin login error ${error}`})
  }
}
