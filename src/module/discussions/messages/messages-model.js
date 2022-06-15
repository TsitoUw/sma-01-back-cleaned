const mongoose = require("mongoose");

const Message = new mongoose.Schema(
  {
    author: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    content: {
      type: String,
      trim: true,
    },
    discussion: {
      type: mongoose.Types.ObjectId,
      ref: "discussion",
    },
  },
  {
    collection: "messages",
    timestamps: true,
  }
);

const model = mongoose.model("message", Message);

module.exports = model;
