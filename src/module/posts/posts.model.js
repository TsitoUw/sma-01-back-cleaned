const mongoose = require("mongoose");

const Post = new mongoose.Schema(
	{
		content: {
			type: String,
			trim: true,
			required: true,
		},
		author: {
			type: mongoose.Types.ObjectId,
			ref: "user",
		},
		picture: {
			type: String,
			default: "none",
		},
		comments: [{type: mongoose.Types.ObjectId, ref: "comment"}],
		likes: [{type: mongoose.Types.ObjectId, ref: "user"}]
	},
	{
		collection: "posts",
		timestamps: true,
	}
);

const model = mongoose.model("post", Post);

module.exports = model;
