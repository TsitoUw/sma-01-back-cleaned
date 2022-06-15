const mongoose = require("mongoose");

const Comment = new mongoose.Schema(
	{
		post: {
			type: mongoose.Types.ObjectId,
			required: true,
		},
		author: {
			type: mongoose.Types.ObjectId,
			ref: "user",
			required: true,
		},
		content: {
			type: String,
			trim: true
		},
    picture: {
      type: String
    }
	},
	{
		collection: "comments",
		timestamps: true,
	}
);

const model = mongoose.model("comment", Comment);

module.exports = model;
