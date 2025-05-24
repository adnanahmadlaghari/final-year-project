import { compare } from "bcrypt";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import {renameSync, unlinkSync} from "fs"

const maxAge = 3 * 24 * 60 * 60 * 1000;
const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
};

export const register = async (req, response, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return response.status(400).send("Email and Password are required.");
    }
    const user = await User.create({ email, password });
    response.cookie("JWT", createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });
    return response.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    console.log(error);
    return response.status(500).send("Internal server error");
  }
};

export const login = async (req, response, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return response.status(400).send("Email and Password are required.");
    }
    const user = await User.findOne({ email });
    if (!user) {
      return response.status(404).send("User with this Email not found.");
    }
    const auth = await compare(password, user.password);
    if (!auth) {
      return response.status(400).send("Password is Incorrect.");
    }
    response.cookie("JWT", createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });
    return response.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
      },
    });
  } catch (error) {
    console.log(error);
    return response.status(500).send("Internal server error");
  }
};

export const getUserInfo = async (req, response, next) => {
  try {
    const userData = await User.findById(req.userId);
    if (!userData) {
      return response.status(404).send("Id not found.");
    }
    return response.status(200).json({
      id: userData.id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color,
    });
  } catch (error) {
    console.log(error);
    return response.status(500).send("Internal server error");
  }
};


export const updateProfile = async (req, response, next) => {
  try {
    const {userId} = req;
    const {firstName, lastName, color} = req.body;
    if (!firstName || !lastName) {
      return response.status(400).send("First Name and Last Name is required.");
    }
    const userData = await User.findByIdAndUpdate(userId, {
        firstName, lastName, color, profileSetup: true
    }, {new: true, runValidators: true});
    return response.status(200).json({
      id: userData.id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color,
    });
  } catch (error) {
    console.log(error);
    return response.status(500).send("Internal server error");
  }
};



export const addProfileImage = async (req, response, next) => {
  try {
    if(!req.file){
        return response.status(400).send("File is required.");
    };

    const date = Date.now();

    let fileName = "upload/profile/" + date + req.file.originalname;
    renameSync(req.file.path, fileName);

    const updateUser = await User.findByIdAndUpdate(req.userId, {image: fileName}, {new: true, runValidators:true})


    return response.status(200).json({
      image: updateUser.image
    });
  } catch (error) {
    console.log(error);
    return response.status(500).send("Internal server error");
  }
};


export const removeProfileImage = async (req, response, next) => {
  try {
    const {userId} = req;
    const user = await User.findById(userId);

    if(!user){
        return response.status(404).send("User Not Found.");
    };

    if(user.image){
        unlinkSync(user.image)
    };

    user.image = null;
    await user.save();

    return response.status(200).send("Image Removed Successfully.")
  } catch (error) {
    console.log(error);
    return response.status(500).send("Internal server error");
  }
};


export const Logout = async (req, response, next) => {
  try {

    response.cookie("JWT", "", {maxAge: 1, secure:true, sameSite: "None"})
    return response.status(200).send("Logout Successful.");
  } catch (error) {
    console.log(error);
    return response.status(500).send("Internal server error");
  }
};
