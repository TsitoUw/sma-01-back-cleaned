const { errException, success } = require("../shared/status");
const path = require("path");
const imageUploader = require("./imageUploader");

const uploadImage = [
  (req, res, next) => {
    if (!req.file) {
      next();
      return;
    }
    const id = req.params.id;
    if (!directory) return errException();
    const basePath = path.join(__dirname, "../../", "static", "upload", id);
    imageUploader("photo", basePath)(req, res, next);
  },
  (req, res, next) => {
    next();
  },
];

module.exports = uploadImage;
