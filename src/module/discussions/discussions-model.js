const mongoose = require("mongoose");

const Discussion = new mongoose.Schema(
  {
    participant: [
      {
        type: mongoose.Types.ObjectId,
        ref: "user",
      },
    ],
    messages: [{
      type: mongoose.Types.ObjectId,
      ref: "message"
    }]
  },
  {
    collection: "discussions",
    timestamps: true,
  }
);

const model = mongoose.model("discussion", Discussion);

module.exports = model;
