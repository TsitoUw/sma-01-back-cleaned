const router = require("express").Router();
const controller = require("./posts.controller");
const { authenticateToken } = require("../../middlewares/auth");
const uploadImage = require("../../middlewares/uploadImage");

// Store a post
router.post("/", authenticateToken, controller.createPost);

// Store a post's comment
router.post("/:id/comments", authenticateToken, controller.commentPost);

// Upload post's image
router.post("/:id/picture", authenticateToken, uploadImage, controller.uploadPicture);

// Get all posts
router.get("/", authenticateToken, controller.getPostPaginated);

// Get a single post
router.get("/:id", authenticateToken, controller.getPostById);

// Find posts
router.get("/search/:text", authenticateToken, controller.getPostByContent);

// Get all post's comments
router.get("/:id/comments", authenticateToken, controller.getPaginatedComment);

// Edit a post
router.put("/:id", authenticateToken, controller.updatePost);

// Edit a comment
router.put("/comments/:id", authenticateToken, controller.updateComment);

// Like post
router.put("/:id/like", authenticateToken, controller.likePost);

// Remove a post
router.delete("/:id", authenticateToken, controller.deletePost);

// Remove a comment
router.delete("/comments/:id", authenticateToken, controller.deleteComment);

module.exports = { router };
