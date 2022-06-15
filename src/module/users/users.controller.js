const service = require("./users.service");

// Store user
const register = async (req, res) => {
  const response = await service.register(req.body);
  res.status(response.status).json({ ...response });
};

// Authenticate user
const login = async (req, res) => {
  const response = await service.login(req.body);
  res.status(response.status).json({ ...response });
};

// Get a single user
const getUser = async (req, res) => {
  const response = await service.getUser(req);
  res.status(response.status).json({ ...response });
};

// Find user by its name
const getUserByName = async (req, res) => {
  const response = await service.getUserByName(req);
  res.status(response.status).json({ ...response });
};

// Get all users paginated
const getPaginatedUsers = async (req, res) => {
  const response = await service.getPaginatedUser(req);
  res.status(response.status).json({ ...response });
};

// Edit user's information
const updateUser = async (req, res) => {
	const response = await service.updateUser(req);
	res.status(response.status).json({ ...response });
};

// Edit user's name
const updateUserName = async (req, res) => {
  const response = await service.updateUserName(req);
  res.status(response.status).json({ ...response });
};

// Edit user's email
const updateUserEmail = async (req, res) => {
  const response = await service.updateUserEmail(req);
  res.status(response.status).json({ ...response });
};

// Edit user's password
const updateUserPassword = async (req, res) => {
  const response = await service.updatePassword(req);
  res.status(response.status).json({ ...response });
};

// Upload user's profile picture
const uploadProfilePicture = async (req, res) => {
  const response = await service.uploadProfilePicture(req);
  res.status(response.status).json({ ...response });
};

// Get user's posts
const getPaginatedUsersPosts = async (req, res) => {
  const response = await service.getPaginatedPosts(req);
  res.status(response.status).json({ ...response });
};

// Remove an user
const deleteUser = async (req, res) => {
  const response = await service.deleteUser(req.params);
  res.status(response.status).json({ ...response });
};

module.exports = {
  register,
  login,
  getPaginatedUsers,
  deleteUser,
  updateUserName,
  updateUserEmail,
  updateUserPassword,
  getUser,
  getPaginatedUsersPosts,
  uploadProfilePicture,
  updateUser,
  getUserByName
};

