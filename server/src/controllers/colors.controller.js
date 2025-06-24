import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Color from "../models/color.model.js";

export const getColors = asyncHandler(async (req, res) => {
  const colors = await Color.aggregate([
    {
      $sort: {
        name: 1,
      },
    },
    {
      $project: {
        __v: 0,
        createdAt: 0,
        updatedAt: 0,
      },
    },
  ]);
  if (!colors) {
    throw new ApiError(404, "No colors found");
  }

  const response = new ApiResponse(
    200,
    "Colors retrieved successfully",
    colors
  );

  return res.status(response.statusCode).json(response);
});
