import mongoose from "mongoose";

// icons {
//   _id ObjectId()
//   url string
//   name string
//   tags string[]
//   type enum[account, category]
//   createdAt Date()
//   updatedAt Date()
// }

const iconSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    type: {
      type: String,
      enum: ["account", "category"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Icon = mongoose.model("Icon", iconSchema);

export default Icon;
