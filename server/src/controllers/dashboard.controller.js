import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../models/user.model.js";
import Account from "../models/account.model.js";
import Transaction from "../models/transaction.model.js";
import { ROLE } from "../constants.js";

export const getAllAccounts = asyncHandler(async (req, res) => {
  const user = req.user;

  const pipeline = [
    {
      $match: {
        familyId: user.familyId,
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

  if (user.role !== ROLE.ADMIN) {
    pipeline.unshift({
      $match: {
        userId: user._id,
      },
    });
  }

  const accounts = await Account.aggregate(pipeline);

  const response = new ApiResponse(
    200,
    "Family Accounts fetched successfully",
    accounts
  );

  return res.status(response.statusCode).json(response);
});

export const getAllMembers = asyncHandler(async (req, res) => {
  const user = req.user;

  const { from, to } = req.query;

  const pipeline = [
    {
      $match: {
        familyId: user.familyId,
      },
    },
    {
      $lookup: {
        from: "transactions",
        let: { userId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$userId", "$$userId"] },
                  {
                    $gte: ["$datetime", new Date(from)],
                  },
                  {
                    $lte: ["$datetime", new Date(to)],
                  },
                ],
              },
            },
          },
          {
            $group: {
              _id: "$type",
              total: { $sum: "$amount" },
            },
          },
        ],
        as: "transactionSummary",
      },
    },
    {
      $addFields: {
        income: {
          $let: {
            vars: {
              incomeObj: {
                $first: {
                  $filter: {
                    input: "$transactionSummary",
                    as: "item",
                    cond: {
                      $eq: ["$$item._id", "income"],
                    },
                  },
                },
              },
            },
            in: {
              $ifNull: ["$$incomeObj.total", 0],
            },
          },
        },
        expense: {
          $let: {
            vars: {
              expenseObj: {
                $first: {
                  $filter: {
                    input: "$transactionSummary",
                    as: "item",
                    cond: {
                      $eq: ["$$item._id", "expense"],
                    },
                  },
                },
              },
            },
            in: {
              $ifNull: ["$$expenseObj.total", 0],
            },
          },
        },
      },
    },
    {
      $project: {
        __v: 0,
        forgotPasswordToken: 0,
        forgotPasswordTokenExpiry: 0,
        verified: 0,
        verifyToken: 0,
        verifyTokenExpiry: 0,
        password: 0,
      },
    },
  ];

  if (user.role !== ROLE.ADMIN) {
    pipeline.unshift({
      $match: {
        _id: user._id,
      },
    });
  }

  const members = await User.aggregate(pipeline);

  const response = new ApiResponse(
    200,
    "Family Members fetched successfully",
    members
  );

  return res.status(response.statusCode).json(response);
});

export const monthlyIncomeExpenseChart = asyncHandler(async (req, res) => {
  const user = req.user;

  const pipeline = [
    {
      $match: {
        familyId: user.familyId,
        datetime: {
          $gte: new Date(
            new Date().getFullYear(),
            new Date().getMonth() - 5,
            1
          ),
          $lte: new Date(),
        },
      },
    },
    {
      $project: {
        amount: 1,
        type: 1,
        month: { $month: "$datetime" },
        year: { $year: "$datetime" },
      },
    },
    {
      $group: {
        _id: {
          year: "$year",
          month: "$month",
          type: "$type",
        },
        total: { $sum: "$amount" },
      },
    },
    {
      $group: {
        _id: { year: "$_id.year", month: "$_id.month" },
        income: {
          $sum: {
            $cond: [{ $eq: ["$_id.type", "income"] }, "$total", 0],
          },
        },
        expense: {
          $sum: {
            $cond: [{ $eq: ["$_id.type", "expense"] }, "$total", 0],
          },
        },
      },
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
      },
    },
    {
      $project: {
        _id: 0,
        month: {
          $concat: [
            {
              $arrayElemAt: [
                [
                  "",
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ],
                "$_id.month",
              ],
            },
            " ",
            { $toString: "$_id.year" },
          ],
        },
        income: 1,
        expense: 1,
      },
    },
  ];

  if (user.role !== ROLE.ADMIN) {
    pipeline.unshift({
      $match: {
        userId: user._id,
      },
    });
  }

  const chartData = await Transaction.aggregate(pipeline);

  const response = new ApiResponse(
    200,
    "Monthly Income/Expense Chart Data fetched successfully",
    chartData
  );

  return res.status(response.statusCode).json(response);
});

export const getDashboardTransaction = asyncHandler(async (req, res) => {
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
    {
      $limit: 10,
    },
  ];

  if (req.user.role === ROLE.ADMIN) {
    pipeline.unshift({
      $match: {
        familyId: req.user.familyId,
      },
    });
  } else {
    pipeline.unshift({
      $match: {
        userId: req.user._id,
      },
    });
  }

  const transaction = await Transaction.aggregate(pipeline);

  const response = new ApiResponse(
    200,
    "Transaction retrieved successfully",
    transaction
  );

  return res.status(response.statusCode).json(response);
});

export const categoryBreakdown = asyncHandler(async (req, res) => {
  const user = req.user;
  const { from, to } = req.query;

  const pipeline = [
    {
      $match: {
        familyId: user.familyId,
        type: "expense",
        datetime: {
          $gte: new Date(from),
          $lte: new Date(to),
        },
      },
    },
    {
      $group: {
        _id: "$categoryId",
        totalAmount: { $sum: "$amount" },
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: "$category" },
    {
      $project: {
        _id: 0,
        categoryId: "$_id",
        categoryName: "$category.name",
        totalAmount: 1,
      },
    },
    {
      $sort: { totalAmount: -1 },
    },
  ];

  if (user.role !== ROLE.ADMIN) {
    pipeline.unshift({
      $match: {
        userId: user._id,
      },
    });
  }

  const breakdown = await Transaction.aggregate(pipeline);

  const response = new ApiResponse(
    200,
    "Category breakdown retrieved successfully",
    breakdown
  );

  return res.status(response.statusCode).json(response);
});
