const postsService = require("./posts.service");
const commentsService = require("./comments/comments.service");

// ---------- POST ----------

// Store a post
const createPost = async (req, res) => {
  const response = await postsService.createPost(req);
  res.status(response.status).json({ ...response });
};

// Edit a post
const updatePost = async (req, res) => {
  const response = await postsService.updatePost(req);
  res.status(response.status).json({ ...response });
};

// Like post
const likePost = async (req, res) => {
  const response = await postsService.likePost(req);
  res.status(response.status).json({ ...response });
};

// Upload post's image
const uploadPicture = async (req, res) => {
  const response = await postsService.uploadPicture(req);
  res.status(response.status).json({ ...response });
};

// Remove a post
const deletePost = async (req, res) => {
  const response = await postsService.deletePost(req);
  res.status(response.status).json({ ...response });
};

// Get all posts
const getPostPaginated = async (req, res) => {
  const response = await postsService.getPostPaginated(req);
  res.status(response.status).json({ ...response });
};

// Find a posts
const getPostByContent = async (req, res) => {
  const response = await postsService.getPostByContent(req);
  res.status(response.status).json({ ...response });
};

// Get a single post
const getPostById = async (req, res) => {
  const response = await postsService.getPostById(req);
  res.status(response.status).json({ ...response });
};

// ---------- COMMENT ----------

// Get all post's comments
const getPaginatedComment = async (req, res) => {
  const response = await commentsService.getPaginatedComment(req);
  res.status(response.status).json({ ...response });
};

// Store a post's comment
const commentPost = async (req, res) => {
  const response = await commentsService.commentPost(req);
  res.status(response.status).json({ ...response });
};

// Edit a comment
const updateComment = async (req, res) => {
  const response = await commentsService.updateComment(req);
  res.status(response.status).json({ ...response });
};

// Remove comment
const deleteComment = async (req, res) => {
  const response = await commentsService.deleteComment(req);
  res.status(response.status).json({ ...response });
};

module.exports = {
  createPost,
  commentPost,
  updatePost,
  deletePost,
  getPostPaginated,
  getPostById,
  deleteComment,
  updateComment,
  getPaginatedComment,
  uploadPicture,
  getPostByContent,
  likePost,
};
