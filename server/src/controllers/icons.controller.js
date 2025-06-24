import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Icon from "../models/icon.model.js";

export const getIcons = asyncHandler(async (req, res) => {
  const { type } = req.query;

  if (type && !["account", "category"].includes(type)) {
    throw new ApiError(
      400,
      "Invalid icon type. Allowed types are: account, category"
    );
  }

  const icons = await Icon.aggregate([
    {
      $match: {
        type,
      },
    },
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
  if (!icons || icons.length === 0) {
    throw new ApiError(404, "No icons found");
  }

  const response = new ApiResponse(200, "Icons retrieved successfully", icons);

  return res.status(response.statusCode).json(response);
});
