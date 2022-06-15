const router = require("express").Router();
const { authenticateToken } = require("../../middlewares/auth");

router.post("/", () => console.log("first"));

module.exports = { router };
