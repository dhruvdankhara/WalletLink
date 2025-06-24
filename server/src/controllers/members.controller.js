import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { ROLE } from "../constants.js";
import { registerSchema } from "../validators/user.schema.js";
import User from "../models/user.model.js";
import { sendMail } from "../utils/helper.js";
import jwt from "jsonwebtoken";

export const addMember = asyncHandler(async (req, res) => {
  if (req.user.role !== ROLE.ADMIN) {
    throw new ApiError(403, "You are not authorized to add members.");
  }

  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required.");
  }

  const member = await User.find({ email });

  if (member.length > 0) {
    throw new ApiError(400, "Member with this email already exists.");
  }

  const token = jwt.sign(
    { email, familyId: req.user.familyId },
    process.env.JWT_SECRET
  );

  const inviteLink = `${process.env.DOMAIN}/invite?token=${token}`;

  await sendMail(
    email,
    "You're Invited to Join Our Family on WalletLink!",
    `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #2563eb; text-align: center;">Welcome to Our Family!</h1>
      <p>Hi there,</p>
      <p>You've been invited to join our family on WalletLink - a secure platform to manage and share financial information with your loved ones.</p>
      <p>Click the button below to complete your registration and join our family:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${inviteLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Join Family</a>
      </div>
      <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #6b7280;">${inviteLink}</p>
      <p>Welcome aboard!</p>
      <p>Best regards,<br>The WalletLink Team</p>
    </div>
    `
  );

  const response = new ApiResponse(200, "Email sent successfully.");
  return res.status(response.statusCode).json(response);
});

export const acceptInvite = asyncHandler(async (req, res) => {
  const { token } = req.query;

  if (!token) {
    throw new ApiError(400, "Token is required.");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new ApiError(400, "Invalid or expired token.");
  }

  const { email, familyId } = decoded;
  const { firstname, lastname, password } = req.body;

  await registerSchema.validate({ email, firstname, lastname, password });

  const user = await User.findOne({ email });

  if (user) {
    throw new ApiError(400, "User with this email already exists.");
  }

  const newUser = await User.create({
    email,
    familyId,
    firstname,
    lastname,
    password,
    role: ROLE.MEMBER,
  });

  const createdUser = await User.findById(newUser._id).select(
    "firstName lastName email role familyId createdAt updatedAt"
  );

  const response = new ApiResponse(
    200,
    "Member added successfully.",
    createdUser
  );
  return res.status(response.statusCode).json(response);
});

export const getMembers = asyncHandler(async (req, res) => {
  if (req.user.role !== ROLE.ADMIN) {
    throw new ApiError(403, "You are not authorized to view members.");
  }

  const members = await User.aggregate([
    {
      $match: {
        familyId: req.user.familyId,
      },
    },
    {
      $project: {
        forgotPasswordToken: 0,
        forgotPasswordTokenExpiry: 0,
        verifyToken: 0,
        verifyTokenExpiry: 0,
        __v: 0,
        password: 0,
      },
    },
    {
      $sort: {
        role: 1,
      },
    },
  ]);

  const response = new ApiResponse(
    200,
    "Members retrieved successfully.",
    members
  );
  return res.status(response.statusCode).json(response);
});

export const getMemberById = asyncHandler(async (req, res) => {
  if (req.user.role !== ROLE.ADMIN) {
    throw new ApiError(403, "You are not authorized to view this member.");
  }

  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Member ID is required.");
  }

  const member = await User.findById(id).select(
    "_id firstname lastname email avatar role familyId verified"
  );

  if (!member) {
    throw new ApiError(404, "Member not found.");
  }

  if (member.familyId.toString() !== req.user.familyId.toString()) {
    throw new ApiError(403, "You are not authorized to view this member.");
  }

  const response = new ApiResponse(
    200,
    "Member retrieved successfully.",
    member
  );
  return res.status(response.statusCode).json(response);
});

export const deleteMember = asyncHandler(async (req, res) => {
  if (req.user.role !== ROLE.ADMIN) {
    throw new ApiError(403, "You are not authorized to delete members.");
  }

  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Member ID is required.");
  }

  const member = await User.findById(id);

  if (!member) {
    throw new ApiError(404, "Member not found.");
  }

  if (member.familyId.toString() !== req.user.familyId.toString()) {
    throw new ApiError(403, "You are not authorized to delete this member.");
  }

  if (member.role === ROLE.ADMIN) {
    throw new ApiError(403, "You cannot delete an admin member.");
  }

  await User.findByIdAndDelete(id);

  const response = new ApiResponse(200, "Member deleted successfully.");
  return res.status(response.statusCode).json(response);
});

export const updateMember = asyncHandler(async (req, res) => {
  if (req.user.role !== ROLE.ADMIN) {
    throw new ApiError(403, "You are not authorized to update members.");
  }

  const { id } = req.params;
  const { firstname, lastname, email, role } = req.body;

  if (!id) {
    throw new ApiError(400, "Member ID is required.");
  }

  const member = await User.findById(id);

  if (!member) {
    throw new ApiError(404, "Member not found.");
  }

  if (member.familyId.toString() !== req.user.familyId.toString()) {
    throw new ApiError(403, "You are not authorized to update this member.");
  }

  // if (member.role === ROLE.ADMIN && role !== ROLE.ADMIN) {
  //   throw new ApiError(403, "You cannot change an admin member's role.");
  // }

  if (email) {
    const existingMember = await User.find({ email });

    if (
      existingMember.length > 0 &&
      existingMember[0]._id.toString() !== member._id.toString()
    ) {
      throw new ApiError(400, "Member with this email already exists.");
    }
  }

  const updatedMember = await User.findByIdAndUpdate(
    id,
    {
      firstname,
      lastname,
      email,
      role,
    },
    { new: true }
  ).select(
    "_id firstname lastname email avatar role familyId verified createdAt updatedAt"
  );

  const response = new ApiResponse(
    200,
    "Member updated successfully.",
    updatedMember
  );
  return res.status(response.statusCode).json(response);
});
