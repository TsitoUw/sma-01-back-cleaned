const Comment = require("./comments.model");
const Post = require("../posts.model");
const status = require("../../../shared/status");
const paginate = require("../../../shared/paginate");

const commentPost = async (req) => {
	let comment;
	const postId = req.params.id;
	const { userId, content } = req.body;

	if (!postId || !userId || postId.trim() == "" || userId.trim() == "") return status.errException();
	if (!content || content.trim() == "") return status.errException();

	const commentData = { post: postId, author: userId, content: content };

	try {
		comment = await Comment.create(commentData);
	} catch (error) {
		return status.errServer();
	}
	comment = comment.toJSON();

	const commentId = comment._id.toString();
	const postUpdate = { $push: { comments: commentId } };

	try {
		await Post.updateOne({ _id: postId }, postUpdate);
	} catch (error) {
		return status.errServer();
	}
	return status.created(comment);
};

const deleteComment = async (req) => {
	let comment;

	let commentId = req.params.id;
	let userId = req.body.userId;

	if (!commentId || commentId.trim() == "" || !userId || userId.trim() == "") return status.errException();

	try {
		comment = await Comment.findOne({ _id: commentId });
	} catch (error) {
		return status.errServer();
	}
	if (!comment) return status.errNotFound("comment not found");
	comment = comment.toJSON();

	//verify if its the post owner who try to delete the comment
	if (comment.author.toString() !== userId) {
		return status.errUnauthorized("unauthorized to do the action");
	}

	try {
		await Comment.deleteOne({ _id: commentId });
	} catch (error) {
		return status.errServer();
	}

	const postUpdate = { $pull: { comments: commentId } };

	try {
		await Post.updateOne({ _id: comment.post.toString() }, postUpdate);
	} catch (error) {
		return status.errServer();
	}

	return status.success();
};

const updateComment = async (req) => {
	let comment;
	const commentId = req.params.id;
	const { author, userId, content } = req.body;

	if (!author || !userId || !content || content.trim() === "") return status.errException();
	if (author !== userId) return status.errException();

	const newCommentValue = { $set: { content: content } };

	try {
		comment = await Comment.findOneAndUpdate({ _id: commentId }, newCommentValue);
	} catch (error) {
		return status.errServer;
	}

	if (!comment) return status.errNotFound();

	return status.success("updated");
};

const getPaginatedComment = async (req) => {
	const postId = req.params.id;
	const result = await paginate.paginateResult(req, Comment, { path: "author", select: ["_id", "name", "email", "profilePicture"] }, { post: postId });
	return result;
};

module.exports = { commentPost, deleteComment, updateComment, getPaginatedComment };
