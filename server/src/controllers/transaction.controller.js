import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { createTransactionSchema } from "../validators/transaction.validator.js";
import Category from "../models/category.model.js";
import Transaction from "../models/transaction.model.js";
import Account from "../models/account.model.js";
import { Types } from "mongoose";
import { ROLE } from "../constants.js";

const transactionAggregation = (transactionId, query = {}, user = null) => {
  const { limit = 10, page = 1, accountId, memberId } = query;
  const skip = (page - 1) * limit;

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
        from: "accounts",
        localField: "accountId",
        foreignField: "_id",
        pipeline: [
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
          {
            $project: {
              _id: 1,
              name: 1,
              userId: 1,
              familyId: 1,
              iconId: 1,
              colorId: 1,
              icon: 1,
              color: 1,
            },
          },
        ],
        as: "account",
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "categoryId",
        foreignField: "_id",
        pipeline: [
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
          {
            $project: {
              _id: 1,
              userId: 1,
              familyId: 1,
              shared: 1,
              name: 1,
              iconId: 1,
              colorId: 1,
              icon: 1,
              color: 1,
            },
          },
        ],
        as: "category",
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
        account: {
          $arrayElemAt: ["$account", 0],
        },
      },
    },
    {
      $set: {
        category: {
          $arrayElemAt: ["$category", 0],
        },
      },
    },
    {
      $project: {
        __v: 0,
      },
    },
    {
      $sort: {
        datetime: -1,
      },
    },
  ];

  if (skip > 0) {
    pipeline.push({
      $skip: skip,
    });
  }

  if (limit) {
    pipeline.push({
      $limit: Number(limit),
    });
  }

  if (accountId) {
    pipeline.unshift({
      $match: {
        accountId: new Types.ObjectId(accountId),
      },
    });
  }
  if (memberId) {
    pipeline.unshift({
      $match: {
        userId: new Types.ObjectId(memberId),
      },
    });
  } else if (user) {
    // Default to family transactions if no specific member
    pipeline.unshift({
      $match: {
        familyId: new Types.ObjectId(user.familyId),
      },
    });
  }

  if (transactionId) {
    pipeline.unshift({
      $match: {
        _id: new Types.ObjectId(transactionId),
      },
    });
  }

  return pipeline;
};

export const createTransaction = asyncHandler(async (req, res) => {
  const { amount, accountId, categoryId, type, description, datetime } =
    req.body;

  await createTransactionSchema.validate({
    amount,
    accountId,
    categoryId,
    type,
    description,
    datetime,
  });

  const category = await Category.findById(categoryId);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  // category belongs to user's family
  // user category
  // shared category

  if (
    !(category.userId.toString() === req.user._id.toString()) &&
    !(
      category.familyId.toString() === req.user.familyId.toString() &&
      category.shared === true
    )
  ) {
    throw new ApiError(403, "You do not have permission to use this category.");
  }

  const account = await Account.findById(accountId);

  if (!account) {
    throw new ApiError(404, "Account not found!");
  }

  if (account.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You do not have permission to use this account.");
  }

  const transaction = await Transaction.create({
    amount,
    userId: req.user._id,
    accountId: account._id,
    familyId: req.user.familyId,
    categoryId: category._id,
    type,
    description,
    datetime: new Date(datetime),
  });
  const newTransaction = await Transaction.aggregate(
    transactionAggregation(transaction._id.toString(), {}, req.user)
  );

  if (newTransaction.length === 0) {
    throw new ApiError(500, "Failed to create transaction");
  }

  const response = new ApiResponse(
    201,
    "Transaction created successfully",
    newTransaction[0]
  );

  return res.status(response.statusCode).json(response);
});

export const getTransaction = asyncHandler(async (req, res) => {
  const { limit = 10, page = 1, accountId, memberId } = req.query;
  const queryParams = {
    limit: Number(limit),
    page: Number(page),
    accountId,
    memberId: memberId || req.user._id,
  };

  // Build match conditions for counting
  const matchConditions = {
    familyId: req.user.familyId,
    userId: new Types.ObjectId(queryParams.memberId),
  };

  if (accountId) {
    matchConditions.accountId = new Types.ObjectId(accountId);
  }

  // Get total count for pagination
  const totalItems = await Transaction.countDocuments(matchConditions);
  const totalPages = Math.ceil(totalItems / queryParams.limit);
  const currentPage = queryParams.page;
  // Get transactions with aggregation
  const transactions = await Transaction.aggregate(
    transactionAggregation(null, queryParams, req.user)
  );

  const pagination = {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage: queryParams.limit,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
  };

  const response = new ApiResponse(
    200,
    "Transactions retrieved successfully",
    transactions,
    pagination
  );

  return res.status(response.statusCode).json(response);
});

export const getTransactionById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(401, "Transaction ID is required");
  }

  const transaction = await Transaction.aggregate(
    transactionAggregation(id, {}, req.user)
  );

  if (transaction.length === 0) {
    throw new ApiError(404, "Transaction not found");
  }

  const response = new ApiResponse(
    200,
    "Transaction retrieved successfully",
    transaction[0]
  );

  return res.status(response.statusCode).json(response);
});

export const deleteTransaction = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(401, "Transaction ID is required");
  }

  const transaction = await Transaction.findById(id);

  if (!transaction) {
    throw new ApiError(404, "Transaction not found");
  }

  if (
    !(transaction.userId === req.user._id) &&
    !(req.user.role === ROLE.ADMIN) &&
    !(transaction.familyId === req.user.familyId)
  ) {
    throw new ApiError(401, "You can not delete this transaction");
  }

  await Transaction.findByIdAndDelete(transaction._id);

  const response = new ApiResponse(200, "Transaction deleted successfully");
  return res.status(response.statusCode).json(response);
});

export const updateTransaction = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { amount, description, accountId, categoryId, type, datetime } =
    req.body;

  if (!id) {
    throw new ApiError(400, "Transaction ID is required");
  }

  const transaction = await Transaction.findById(id);

  if (!transaction) {
    throw new ApiError(404, "Transaction not found");
  }

  // Check if user has permission to update this transaction
  if (
    !(transaction.userId.toString() === req.user._id.toString()) &&
    !(req.user.role === ROLE.ADMIN) &&
    !(transaction.familyId.toString() === req.user.familyId.toString())
  ) {
    throw new ApiError(
      403,
      "You don't have permission to update this transaction"
    );
  }

  // Validate account exists and user has access
  if (accountId) {
    const account = await Account.findById(accountId);
    if (!account) {
      throw new ApiError(404, "Account not found");
    }

    if (
      !(account.userId.toString() === req.user._id.toString()) &&
      !(req.user.role === ROLE.ADMIN) &&
      !(account.familyId.toString() === req.user.familyId.toString())
    ) {
      throw new ApiError(403, "You don't have access to this account");
    }
  }

  // Validate category exists
  if (categoryId) {
    const category = await Category.findById(categoryId);
    if (!category) {
      throw new ApiError(404, "Category not found");
    }
  }

  // Update the transaction
  const updatedTransaction = await Transaction.findByIdAndUpdate(
    id,
    {
      ...(amount !== undefined && { amount }),
      ...(description !== undefined && { description }),
      ...(accountId && { accountId }),
      ...(categoryId && { categoryId }),
      ...(type && { type }),
      ...(datetime && { datetime }),
    },
    { new: true }
  );
  // Get the updated transaction with populated fields
  const populatedTransaction = await Transaction.aggregate(
    transactionAggregation(updatedTransaction._id, {}, req.user)
  );

  if (!populatedTransaction || populatedTransaction.length === 0) {
    throw new ApiError(404, "Updated transaction not found");
  }

  const response = new ApiResponse(
    200,
    "Transaction updated successfully",
    populatedTransaction[0]
  );

  return res.status(response.statusCode).json(response);
});
