import mongoose from "mongoose";

// transactions {
//   _id ObjectId()
//   amount Number
//   userId ObjectId()
//   accountId ObjectId()
//   familyId ObjectId()
//   categoryId ObjectId()
//   type enum[income, expense]
//   description string
//   datetime Date()
//   attachments string
//   createdAt Date()
//   updatedAt Date()
// }

const transactionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    familyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Family",
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    datetime: {
      type: Date,
      required: true,
    },
    attachments: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
