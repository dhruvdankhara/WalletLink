import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { cookieOption, ROLE } from "../constants.js";
import {
  changePasswordSchema,
  loginSchema,
  registerSchema,
  updateUserSchema,
} from "../validators/user.schema.js";
import { deleteImage, uploadImage } from "../utils/cloudinary.js";
import Family from "../models/family.model.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  await registerSchema.validate({ firstname, lastname, email, password });

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "User with this email already exist");
  }

  const user = await User.create({
    firstname,
    lastname,
    email,
    password,
    role: ROLE.ADMIN,
  });

  const createdUser = await User.findById(user._id).select(
    "_id firstname lastname email role avatar"
  );

  if (!createdUser) {
    throw new ApiError(500, "Failed to create user");
  }

  const family = await Family.create({
    name: lastname + "'s  family",
    adminId: createdUser._id,
  });

  if (!family) {
    throw new ApiError(500, "Failed to create family");
  }

  user.familyId = family._id;
  await user.save();

  const token = await createdUser.generateAccessToken();

  const response = new ApiResponse(
    201,
    { user: createdUser, token },
    "User register successfully"
  );
  return res
    .status(response.statusCode)
    .cookie("token", token, cookieOption)
    .json(response);
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  await loginSchema.validate({ email, password });

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found with this email");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Password is incorrect");
  }

  const token = await user.generateAccessToken();

  const loggedInUser = await User.findById(user._id).select(
    "_id firstname lastname email role avatar"
  );

  const response = new ApiResponse(
    200,
    { user: loggedInUser, token },
    "User login successfully."
  );
  return res
    .status(response.statusCode)
    .cookie("token", token, cookieOption)
    .json(response);
});

export const logoutUser = asyncHandler((req, res) => {
  const response = new ApiResponse(200, {}, "User logged out successfully");
  return res
    .status(response.statusCode)
    .clearCookie("token", cookieOption)
    .json(response);
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const { _id, firstname, lastname, email, avatar, role, verified, familyId } =
    req.user;
  const response = new ApiResponse(200, "user fetched successfully", {
    _id,
    firstname,
    lastname,
    email,
    avatar,
    role,
    verified,
    familyId,
  });
  return res.status(response.statusCode).json(response);
});

export const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  await changePasswordSchema.validate({ oldPassword, newPassword });

  const user = await User.findById(req.user._id);

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid old password");
  }

  user.password = newPassword;

  await user.save();

  const response = new ApiResponse(200, {}, "Password changed successfully");
  return res.status(response.statusCode).json(response);
});

export const changeAvatar = asyncHandler(async (req, res) => {
  const user = req.user;
  const file = req.file;

  if (!file) {
    throw new ApiError(400, "Please provide an image");
  }

  if (user.avatar) {
    await deleteImage(
      user.avatar.substring(user.avatar.lastIndexOf("/") + 1).split(".")[0]
    );
  }

  const imageUrl = await uploadImage(file.path);

  if (!imageUrl) {
    throw new ApiError(500, "Failed to upload image");
  }

  user.avatar = imageUrl.secure_url;

  await user.save();

  const response = new ApiResponse(200, user, "profile image updated");
  return res.status(response.statusCode).json(response);
});

export const updateUser = asyncHandler(async (req, res) => {
  const { user } = req;
  const { name, email } = req.body;

  await updateUserSchema.validate({ email });

  if (email) {
    const isEmailTaken = await User.findOne({ email });

    if (isEmailTaken && isEmailTaken._id.toString() !== user._id.toString()) {
      throw new ApiError(409, "Email already exists");
    }
  }

  // Update user details
  user.firstname = name || user.firstname;
  user.lastname = name || user.lastname;
  user.email = email || user.email;

  await user.save();

  const response = new ApiResponse(200, user, "User updated successfully");
  return res.status(response.statusCode).json(response);
});
