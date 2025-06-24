import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Icon from "../models/icon.model.js";
import Color from "../models/color.model.js";
import Category from "../models/category.model.js";
import { createCategorySchema } from "../validators/category.validator.js";
import { ROLE } from "../constants.js";
import Transaction from "../models/transaction.model.js";

const getCategoryPipline = (categoryId) => {
  return [
    {
      $match: {
        _id: categoryId,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        pipeline: [
          {
            $project: {
              _id: 1,
              firstname: 1,
              lastname: 1,
              email: 1,
              avatar: 1,
              role: 1,
              verified: 1,
            },
          },
        ],
        as: "user",
      },
    },
    {
      $lookup: {
        from: "icons",
        localField: "iconId",
        foreignField: "_id",
        pipeline: [
          {
            $project: {
              _id: 1,
              name: 1,
              url: 1,
              tags: 1,
            },
          },
        ],
        as: "icon",
      },
    },
    {
      $lookup: {
        from: "colors",
        localField: "colorId",
        foreignField: "_id",
        pipeline: [
          {
            $project: {
              _id: 1,
              name: 1,
              tailwindClass: 1,
              hex: 1,
            },
          },
        ],
        as: "color",
      },
    },
    {
      $set: {
        user: {
          $arrayElemAt: ["$user", 0],
        },
      },
    },
    {
      $set: {
        icon: {
          $arrayElemAt: ["$icon", 0],
        },
      },
    },
    {
      $set: {
        color: {
          $arrayElemAt: ["$color", 0],
        },
      },
    },
  ];
};

export const createCategory = asyncHandler(async (req, res) => {
  const { name, iconId, shared, colorId } = req.body;

  await createCategorySchema.validate({ name, iconId, shared, colorId });

  // Check if the icon exists
  const icon = await Icon.findById(iconId);
  if (!icon) {
    throw new ApiError(404, "Icon not found");
  }

  // Check if the color exists
  const color = await Color.findById(colorId);
  if (!color) {
    throw new ApiError(404, "Color not found");
  }

  const category = await Category.create({
    name,
    iconId,
    shared,
    colorId,
    userId: req.user._id,
    familyId: req.user.familyId,
  });

  if (!category) {
    throw new ApiError(500, "Failed to create category");
  }

  const createdCategory = await Category.aggregate(
    getCategoryPipline(category._id)
  );

  const response = new ApiResponse(
    201,
    "Category created successfully",
    createdCategory[0]
  );
  return res.status(response.statusCode).json(response);
});

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.aggregate([
    {
      $match: {
        $or: [
          {
            userId: req.user._id,
          },
          {
            $and: [
              {
                familyId: req.user.familyId,
              },
              { shared: true },
            ],
          },
        ],
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        pipeline: [
          {
            $project: {
              _id: 1,
              firstname: 1,
              lastname: 1,
              email: 1,
              avatar: 1,
              role: 1,
              verified: 1,
            },
          },
        ],
        as: "user",
      },
    },
    {
      $lookup: {
        from: "icons",
        localField: "iconId",
        foreignField: "_id",
        pipeline: [
          {
            $project: {
              _id: 1,
              name: 1,
              url: 1,
              tags: 1,
            },
          },
        ],
        as: "icon",
      },
    },
    {
      $lookup: {
        from: "colors",
        localField: "colorId",
        foreignField: "_id",
        pipeline: [
          {
            $project: {
              _id: 1,
              name: 1,
              tailwindClass: 1,
              hex: 1,
            },
          },
        ],
        as: "color",
      },
    },
    {
      $set: {
        user: {
          $arrayElemAt: ["$user", 0],
        },
      },
    },
    {
      $set: {
        icon: {
          $arrayElemAt: ["$icon", 0],
        },
      },
    },
    {
      $set: {
        color: {
          $arrayElemAt: ["$color", 0],
        },
      },
    },
  ]);
  const response = new ApiResponse(
    200,
    "Categories retrieved successfully",
    categories || []
  );
  return res.status(response.statusCode).json(response);
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  if (
    !(category.userId.toString() === req.user._id.toString()) &&
    !(req.user.role === ROLE.ADMIN)
  ) {
    throw new ApiError(403, "You are not authorized to delete this category");
  }

  const hasTransactions = await Transaction.find({ categoryId: category._id });

  if (hasTransactions.length > 0) {
    throw new ApiError(
      400,
      "Category cannot be deleted because it has transactions"
    );
  }

  await Category.findByIdAndDelete(id);

  const response = new ApiResponse(200, "Category deleted successfully");
  return res.status(response.statusCode).json(response);
});

export const EditCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, iconId, colorId, shared } = req.body;

  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  if (
    !(category.userId.toString() === req.user._id.toString()) &&
    !(req.user.role === ROLE.ADMIN)
  ) {
    throw new ApiError(403, "You are not authorized to edit this category");
  }

  await Category.findByIdAndUpdate(id, {
    name,
    iconId,
    colorId,
    shared,
  });

  const updatedCategory = await Category.aggregate(
    getCategoryPipline(category._id)
  );

  if (!updatedCategory) {
    throw new ApiError(500, "Failed to update category");
  }

  const response = new ApiResponse(
    200,
    "Category updated successfully",
    updatedCategory[0]
  );
  return res.status(response.statusCode).json(response);
});
