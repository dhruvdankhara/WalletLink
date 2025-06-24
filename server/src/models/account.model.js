import mongoose from "mongoose";

// accounts {
//   _id ObjectId()
//   name string
//   initialBalance Number
//   userId ObjectId()
//   familyId ObjectId()
//   iconId ObjectId()
//   colorId ObjectId()
//   createdAt Date()
//   updatedAt Date()
// }

const accountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    initialBalance: {
      type: Number,
      required: true,
      default: 0,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    familyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Family",
      required: true,
    },
    iconId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Icon",
    },
    colorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Color",
    },
  },
  {
    timestamps: true,
  }
);

const Account = mongoose.model("Account", accountSchema);

export default Account;
