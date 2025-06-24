import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  createAccountSchema,
  updateAccountSchema,
} from "../validators/account.validator.js";
import Account from "../models/account.model.js";
import Icon from "../models/icon.model.js";
import User from "../models/user.model.js";
import Color from "../models/color.model.js";
import { ROLE } from "../constants.js";
import Transaction from "../models/transaction.model.js";
import { Types } from "mongoose";

const getAccountAggregationPipeline = (accountId) => {
  return [
    {
      $match: {
        _id: new Types.ObjectId(accountId),
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
              familyId: 1,
            },
          },
        ],
        as: "user",
      },
    },
    {
      $lookup: {
        from: "families",
        localField: "familyId",
        foreignField: "_id",
        pipeline: [
          {
            $project: {
              _id: 1,
              name: 1,
              adminId: 1,
            },
          },
        ],
        as: "family",
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
      $lookup: {
        from: "transactions",
        localField: "_id",
        foreignField: "accountId",
        as: "transactions",
      },
    },
    {
      $set: {
        user: {
          $arrayElemAt: ["$user", 0],
        },

        family: {
          $arrayElemAt: ["$family", 0],
        },

        icon: {
          $arrayElemAt: ["$icon", 0],
        },
        color: {
          $arrayElemAt: ["$color", 0],
        },
        income: {
          $sum: {
            $map: {
              input: "$transactions",
              as: "tx",
              in: {
                $cond: [{ $eq: ["$$tx.type", "income"] }, "$$tx.amount", 0],
              },
            },
          },
        },
        expense: {
          $sum: {
            $map: {
              input: "$transactions",
              as: "tx",
              in: {
                $cond: [{ $eq: ["$$tx.type", "expense"] }, "$$tx.amount", 0],
              },
            },
          },
        },
      },
    },
    {
      $set: {
        currentBalance: {
          $add: ["$initialBalance", { $subtract: ["$income", "$expense"] }],
        },
      },
    },
    {
      $project: {
        __v: 0,
        updatedAt: 0,
      },
    },
  ];
};

export const createAccount = asyncHandler(async (req, res) => {
  const { name, initialBalance, iconId, colorId } = req.body;

  await createAccountSchema.validate({
    name,
    initialBalance: initialBalance || 0,
    iconId,
    colorId,
  });

  // check icon exists
  // check color exists

  const icon = await Icon.findById(iconId);
  if (!icon) {
    throw new ApiError(400, "Icon not found");
  }

  const color = await Color.findById(colorId);
  if (!color) {
    throw new ApiError(400, "Color not found");
  }

  const account = await Account.create({
    name,
    initialBalance,
    userId: req.user._id,
    familyId: req.user.familyId,
    iconId,
    colorId,
  });

  if (!account) {
    throw new ApiError(500, "Failed to create account");
  }

  const createdAccount = await Account.aggregate(
    getAccountAggregationPipeline(account._id)
  );

  const response = new ApiResponse(
    201,
    "Account created successfully",
    createdAccount[0]
  );

  return res.status(response.statusCode).json(response);
});

export const getAccounts = asyncHandler(async (req, res) => {
  const user = req.user;

  const pipeline = [
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
              familyId: 1,
            },
          },
        ],
        as: "user",
      },
    },
    {
      $lookup: {
        from: "families",
        localField: "familyId",
        foreignField: "_id",
        pipeline: [
          {
            $project: {
              _id: 1,
              name: 1,
              adminId: 1,
            },
          },
        ],
        as: "family",
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
      $lookup: {
        from: "transactions",
        localField: "_id",
        foreignField: "accountId",
        as: "transactions",
      },
    },
    {
      $set: {
        user: {
          $arrayElemAt: ["$user", 0],
        },

        family: {
          $arrayElemAt: ["$family", 0],
        },

        icon: {
          $arrayElemAt: ["$icon", 0],
        },
        color: {
          $arrayElemAt: ["$color", 0],
        },
        income: {
          $sum: {
            $map: {
              input: "$transactions",
              as: "tx",
              in: {
                $cond: [{ $eq: ["$$tx.type", "income"] }, "$$tx.amount", 0],
              },
            },
          },
        },
        expense: {
          $sum: {
            $map: {
              input: "$transactions",
              as: "tx",
              in: {
                $cond: [{ $eq: ["$$tx.type", "expense"] }, "$$tx.amount", 0],
              },
            },
          },
        },
      },
    },
    {
      $set: {
        currentBalance: {
          $add: ["$initialBalance", { $subtract: ["$income", "$expense"] }],
        },
      },
    },
    {
      $project: {
        __v: 0,
        updatedAt: 0,
      },
    },
  ];

  const { memberId } = req.query;

  if (memberId) {
    if (req.user.role !== ROLE.ADMIN) {
      throw new ApiError(
        403,
        "You are not allowed to access this member's accounts"
      );
    }

    const member = await User.findById(memberId);

    if (!member) {
      throw new ApiError(404, "Member not found");
    }

    pipeline.unshift({
      $match: {
        userId: member._id,
      },
    });
  } else {
    pipeline.unshift({
      $match: {
        userId: req.user._id,
      },
    });
  }

  const accounts = await Account.aggregate(pipeline);

  const response = new ApiResponse(
    200,
    "Accounts fetched successfully",
    accounts
  );

  return res.status(response.statusCode).json(response);
});

export const updateAccount = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!req.body) {
    throw new ApiError(400, "Data required to update account");
  }

  const { name, iconId, colorId } = req.body;

  await updateAccountSchema.validate({
    name,
    iconId,
    colorId,
    _id: id,
  });

  const account = await Account.findById(id);

  if (!account) {
    throw new ApiError(404, "Account not found");
  }

  if (account.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not allowed to update this account");
  }

  // check icon exists
  if (iconId) {
    const icon = await Icon.findById(iconId);
    if (!icon) {
      throw new ApiError(400, "Icon not found");
    }
    account.iconId = iconId;
  }

  // check color exists
  if (colorId) {
    const color = await Color.findById(colorId);
    if (!color) {
      throw new ApiError(400, "Color not found");
    }
    account.colorId = colorId;
  }

  account.name = name;

  await account.save();

  const updatedAccount = await Account.aggregate(
    getAccountAggregationPipeline(account._id)
  );

  const response = new ApiResponse(
    200,
    "Account updated successfully",
    updatedAccount[0]
  );

  return res.status(response.statusCode).json(response);
});

export const deleteAccount = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Account ID is required");
  }

  const account = await Account.findById(id);

  if (!account) {
    throw new ApiError(404, "Account not found");
  }

  if (
    !(
      account.userId.toString() === req.user._id.toString() ||
      (req.user.role === ROLE.ADMIN &&
        account.familyId.toString() === req.user.familyId.toString())
    )
  ) {
    throw new ApiError(403, "You are not allowed to delete this account");
  }

  const relatedTransactions = await Transaction.find({
    accountId: id,
  });

  if (relatedTransactions.length > 0) {
    throw new ApiError(400, "Cannot delete account with related transactions");
  }

  await Account.findByIdAndDelete(id);

  const response = new ApiResponse(200, "Account deleted successfully");
  return res.status(response.statusCode).json(response);
});

export const getAccountById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Account ID is required");
  }

  const account = await Account.aggregate(getAccountAggregationPipeline(id));

  if (account.length === 0) {
    throw new ApiError(404, "Account not found");
  }

  const response = new ApiResponse(
    200,
    "Account fetched successfully",
    account[0]
  );

  return res.status(response.statusCode).json(response);
});
