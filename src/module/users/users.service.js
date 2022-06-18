const User = require("./users.model");
const Post = require("../posts/posts.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const { isValidEmail, isValidPassword, isValidName } = require("./users.utils");
const status = require("../../shared/status");
const { paginateResult } = require("../../shared/paginate");

const register = async (body) => {
  if (!isValidEmail(body.email) || !isValidPassword(body.password)) return status.errException();
  if (body.name && !isValidName(body.name)) return status.errException();

  const hash = await bcrypt.hash(body.password, 10);
  const data = body.name
    ? {
        name: body.name,
        email: body.email,
        password: hash,
      }
    : {
        email: body.email,
        password: hash,
      };
  let user;

  try {
    user = (await User.create(data)).toJSON();
    delete user.password;
  } catch (error) {
    return status.errFailed("email already taken");
  }

  return status.created(user);
};

const login = async (body) => {
  if (!isValidEmail(body.email) || !isValidPassword(body.password)) return status.errException();
  if (body.keepLogged == null || body.keepLogged == undefined) return status.errException();
  let user;
  try {
    user = await User.findOne({ email: body.email });
  } catch (error) {
    return status.errServer();
  }

  if (!user) return status.errFailed("email not found");
  user = user.toJSON();

  if (!(await bcrypt.compare(body.password, user.password))) return status.errFailed("password not matching");
  delete user.password;
  const keepLogged = body.keepLogged ? null : { expiresIn: "1h" };
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, keepLogged);

  return status.success({ accessToken: accessToken, userId: user._id });
};

const getUser = async (req) => {
  const id = req.params.id;
  let user;
  if (!id) return status.errException();
  try {
    user = await User.findOne({ _id: id });
  } catch (error) {
    return status.errServer();
  }
  if (!user) return status.errNotFound();
  user = user.toJSON();
  delete user.password;
  delete user.discussions;
  return status.success(user);
};

const getUserByName = async (req) => {
  const text = req.params.text;
  if (!text || text.trim() == "" || text.trim().length < 2) return status.success([]);
  const search = new RegExp(text, "i");
  const filter = { name: search };
  let result = await paginateResult(req, User, null, filter);
  let user = result.data.map((u) => {
    u = u.toJSON();
    delete u.password;
    delete u.discussions;
    return u;
  });
  result.data = user;

  return result;
};

const getPaginatedUser = async (req) => {
  let result = await paginateResult(req, User);
  let users;
  if (result) {
    users = result.data.map((user) => {
      user = user.toJSON();
      delete user.password;
      delete user.discussions;
      return user;
    });
    delete result.data;
    result.data = users;
  }
  return result;
};

const deleteUser = async (params) => {
  try {
    await User.deleteOne({ _id: params.id });
  } catch (error) {
    return status.errNotFound("user not found");
  }

  try {
    await Post.deleteMany({ author: params.id });
  } catch (error) {
    return status.errNotFound("users post's not deleted");
  }

  return status.success();
};

const updateUser = async (req) => {
  let user;
  const { name, email } = req.body;
  if (!isValidName(name)) return status.errException("Name should be atleast 3 characters, and less than 50");
  if (!isValidEmail(email)) return status.errException("invalid email");

  const update = { $set: { name: name, email: email } };
  try {
    user = await User.findOneAndUpdate({ _id: req.params.id }, update);
  } catch (error) {
    return status.errFailed("email already taken");
  }

  try {
    user = await User.findOne({ _id: req.params.id });
  } catch (error) {
    return status.errServer();
  }
  user = user.toJSON();
  delete user.password;

  return status.success(user);
};

const updateUserName = async (req) => {
  let user;
  if (!isValidName(req.body.name)) return status.errException("Name should be atleast 3 characters");

  let newNameValue = { $set: { name: req.body.name } };
  try {
    user = (await User.findOneAndUpdate({ _id: req.params.id }, newNameValue)).toJSON();
    delete user.password;
  } catch (error) {
    return status.errServer();
  }

  return status.success(user);
};

const updateUserEmail = async (req) => {
  let user;
  if (!req.body.newEmail) return status.errException();
  if (!isValidEmail(req.body.newEmail)) return status.errException();

  const newEmailValue = { $set: { email: req.body.newEmail } };
  try {
    user = (await User.findOneAndUpdate({ _id: req.params.id }, newEmailValue)).toJSON();
    delete user.password;
  } catch (error) {
    return status.errServer();
  }

  return status.success(user);
};

const updatePassword = async (req) => {
  let user;
  if (!req.body.password) return status.errException();
  if (!isValidPassword(req.body.password)) return status.errException("passowrd should be atleast 8 characters");

  const hash = await bcrypt.hash(req.body.password, 10);
  let newPasswordValue = { $set: { password: hash } };

  try {
    user = (await User.findOneAndUpdate({ _id: req.params.id }, newPasswordValue)).toJSON();
    delete user.password;
  } catch (error) {
    return status.errServer();
  }

  return status.success();
};

const getPaginatedPosts = async (req) => {
  let posts;
  const userId = req.params.id;
  if (!userId || userId.trim() === "") return status.errException();

  try {
    posts = await paginateResult(req, Post, { path: "author", select: ["_id", "name", "email", "profilPicture"] }, { author: userId });
  } catch (error) {
    return status.errServer();
  }

  return posts;
};

const uploadProfilePicture = async (req) => {
  let user;
  const userId = req.params.id;
  const profilePicture = { $set: { profilePicture: req.file.filename } };

  try {
    user = await User.findOneAndUpdate({ _id: userId }, profilePicture);
  } catch (error) {
    return status.errServer();
  }
  user = user.toJSON();

  if (user.profilePicture != "none") {
    const path = __dirname + "../../../../static/users/" + userId + "/" + user.profilPicture;
    //delete old profil pic
    fs.unlink(path, (err) => {
      if (err) console.log(err);
      console.log("File deleted");
    });
  }

  return status.success("image uploaded");
};

module.exports = {
  register,
  login,
  deleteUser,
  updateUserName,
  updateUserEmail,
  updatePassword,
  getPaginatedUser,
  getUser,
  getPaginatedPosts,
  uploadProfilePicture,
  updateUser,
  getUserByName,
};
