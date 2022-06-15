const router = require("express").Router();
const { authenticateToken } = require("../../middlewares/auth");
const controller = require("./users.controller");
const uploadImage = require("../../middlewares/uploadImage");

// Store user
router.post("/", controller.register);

// Authenticate user
router.post("/authenticate", controller.login);

// Get all users paginated
router.get("/", authenticateToken, controller.getPaginatedUsers);

// Get a single user
router.get("/:id", authenticateToken, controller.getUser);

// Find user by its name
router.get("/search/:text", authenticateToken, controller.getUserByName);

// Get user's posts
router.get("/:id/posts", authenticateToken, controller.getPaginatedUsersPosts);

// Edit user's informations
router.put("/:id", authenticateToken, controller.updateUser);

// Edit user's name
router.put("/:id/name", authenticateToken, controller.updateUserName);

// Edit user's email
router.put("/:id/email", authenticateToken, controller.updateUserEmail);

// Edit user's password
router.put("/:id/password", authenticateToken, controller.updateUserPassword);

// Upload user's profile picture
router.put("/:id/profile/picture", authenticateToken, uploadImage, controller.uploadProfilePicture);

// Remove an user
router.delete("/:id", authenticateToken, controller.deleteUser);


module.exports = { router };
