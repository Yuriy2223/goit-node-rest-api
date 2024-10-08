import mongoose, { Schema } from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },

    name: {
      type: String,
      required: [true, "Set name for contact"],
    },

    email: {
      type: String,
      required: [true, "Set email for contact"],
    },

    phone: {
      type: String,
      required: [true, "Set phone for contact"],
    },

    favorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default mongoose.model("Contact", contactSchema);
