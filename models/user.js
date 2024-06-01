import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
    },

    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },

    avatarURL: {
      type: String,
      default: null,
    },

    token: {
      type: String,
      default: null,
    },
  },

  {
    versionKey: false,
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
