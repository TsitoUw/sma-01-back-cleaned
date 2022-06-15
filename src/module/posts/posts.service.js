const Post = require("./posts.model");
const Comment = require("./comments/comments.model");
const fs = require("fs");
const status = require("../../shared/status");
const { paginateResult } = require("../../shared/paginate");

const createPost = async (req) => {
  let post;
  const { author, content } = req.body;

  if (!author || author.trim() == "") return status.errException();
  if (!content || content.trim() == "") return status.errException();

  data = {
    content: content,
    author: author,
  };

  try {
    post = await Post.create(data);
  } catch (error) {
    return status.errServer();
  }
  post = post.toJSON();

  return status.created(post);
};

const getPostById = async (req) => {
  let post;
  const postId = req.params.id;

  if (!postId || postId.trim() == "") return status.errException();

  try {
    post = await Post.findOne({ _id: postId }).populate({
      path: "author",
      select: ["_id", "name", "email", "profilePicture"],
    });
  } catch (error) {
    return status.errServer();
  }
  if (!post) return status.errNotFound("post not found");

  post = post.toJSON();
  return status.success(post);
};

const getPostByContent = async (req) => {
  const text = req.params.text;
  if (!text || text.trim() == "" || text.trim().length < 2) return status.success([]);
  const search = new RegExp(text, "i");
  const filter = { content: search };
  const result = await paginateResult(req, Post, { path: "author", select: ["_id", "name", "email", "profilePicture"] }, filter);
  return result;
};

const getPostPaginated = async (req) => {
  let res = await paginateResult(req, Post, { path: "author", select: ["_id", "name", "email", "profilePicture"] });
  return res;
};

const updatePost = async (req) => {
  let post;
  const { userId, author, content } = req.body;
  const postId = req.params.id;
  if (!userId || !author || userId !== author) return status.errUnauthorized();

  if (!content || content.trim() == "") return status.errException();
  const newPostValue = { $set: { content: content } };
  try {
    post = await Post.findOneAndUpdate({ _id: postId }, newPostValue);
  } catch (error) {
    return status.errServer();
  }
  if (!post) return status.errNotFound("post not found");

  return status.success("updated");
};

const deletePost = async (req) => {
  const postId = req.params.id;
  const actualUser = req.body.actualUser;
  let post;

  console.log(postId);

  if (!postId || !actualUser || actualUser.trim() == "" || postId.trim() == "") return status.errException();

  try {
    post = await Post.findOne({ _id: postId });
  } catch (error) {
    return status.errServer();
  }

  if (!post) return status.errNotFound("post not found");
  post = post.toJSON();
  if (post.author.toString() !== actualUser) return status.errUnauthorized();

  try {
    await Post.deleteOne({ _id: postId });
  } catch (error) {
    return status.errServer();
  }
  try {
    await Comment.deleteMany({ post: postId });
  } catch {
    return status.errServer();
  }

  console.log(post.picture);

  if (post.picture !== "none" || post.picture !== undefined) {
    const path = __dirname + "../../../../static/posts/" + post._id + "/" + post.picture;
    //delete picture
    fs.unlink(path, (err) => {
      if (err) console.log(err);
      console.log("File deleted");
    });
  }

  return status.success("deleted");
};

const uploadPicture = async (req) => {
  const postId = req.params.id;
  console.log(req.file);
  const picture = { $set: { picture: req.file.filename } };
  try {
    await Post.updateOne({ _id: postId }, picture);
  } catch (error) {
    return status.errServer();
  }

  return status.success("image uploaded");
};

const likePost = async (req) => {
  const postId = req.params.id;
  const userId = req.body.userId;
  let post;
  let alreadyLiked;

  if (!postId || !userId) return status.errException();

  try {
    post = Post.findOne({ _id: postId });
  } catch (error) {
    return status.errServer();
  }

  if (!post) return status.errNotFound();

  post = post.toJSON();

  const likesCount = post.likes.length;
  for (let i = 0; i < likesCount; i++) {
    if (post.likes[i] === userId) {
      alraeadyLiked = true;
    }
  }

  const likes = alreadyLiked ? { $pull: { likes: userId } } : { $pull: { likes: userId } };

  try {
    Post.updateOne({ _id: postId }, likes);
  } catch (err) {
    return status.errServer();
  }

  return status.success("updated");
};

module.exports = { createPost, updatePost, deletePost, getPostById, getPostPaginated, uploadPicture, getPostByContent, likePost };
