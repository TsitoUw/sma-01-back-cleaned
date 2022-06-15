const mongoose = require("mongoose");

const User = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: "Unknown",
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: "none",
    },
    following: [
      {
        type: mongoose.Types.ObjectId,
        ref: "user",
      },
    ],
    discussions: [
      {
        type: mongoose.Types.ObjectId,
        ref: "message",
      },
    ],
  },
  {
    collection: "users",
    timestamps: true,
  }
);

const model = mongoose.model("user", User);

module.exports = model;
