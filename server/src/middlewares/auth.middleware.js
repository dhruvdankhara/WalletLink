import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { decodeToken } from "../utils/helper.js";
import User from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    throw new ApiError(401, "Unauthorized");
  }

  try {
    const payload = decodeToken(token);

    const user = await User.findById(payload._id);

    if (!user) {
      throw new ApiError(401, "Invalid token");
    }

    req.user = user;

    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid token");
  }
});

export const requireAdmin = asyncHandler(async (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    throw new ApiError(403, "Forbidden: Admins only");
  }
  next();
});
