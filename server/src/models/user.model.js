import mogoose from "mongoose";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/helper.js";

// users {
//   _id ObjectId()
//   firstname string
//   lastname string
//   email string
//   password string
//   avatar string
//   role enum[admin, member]
//   familyId ObjectId()
//   forgotPasswordToken string
//   forgotPasswordTokenExpiry Date()
//   verified boolean
//   verifyToken string
//   verifyTokenExpiry Date()
//   createdAt Date()
//   updatedAt Date()
// }

const userSchema = new mogoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["admin", "member"],
      default: "member",
    },
    familyId: {
      type: mogoose.Schema.Types.ObjectId,
      ref: "Family",
    },
    forgotPasswordToken: {
      type: String,
      default: "",
    },
    forgotPasswordTokenExpiry: {
      type: Date,
      default: null,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verifyToken: {
      type: String,
      default: "",
    },
    verifyTokenExpiry: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  const payload = {
    _id: this._id,
    firstname: this.firstname,
    lastname: this.lastname,
    email: this.email,
    role: this.role,
    avatar: this.avatar,
  };
  return generateToken(payload);
};

const User = mogoose.model("User", userSchema);

export default User;
