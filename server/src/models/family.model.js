import mongoose from "mongoose";

// families {
//   _id ObjectId()
//   name string
//   adminId ObjectId()
//   createdAt Date()
//   updatedAt Date()
// }

const familySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Family = mongoose.model("Family", familySchema);

export default Family;
