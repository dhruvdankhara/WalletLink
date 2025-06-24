import mongoose from "mongoose";

// colors {
//   _id ObjectId()
//   name string
//   tailwindClass string
//   hex string
//   createdAt Date()
//   updatedAt Date()
// }

const colorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    tailwindClass: {
      type: String,
      required: true,
      trim: true,
    },
    hex: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Color = mongoose.model("Color", colorSchema);

export default Color;
