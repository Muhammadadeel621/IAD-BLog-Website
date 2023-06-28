const jwt = require("jsonwebtoken");

const createAccessToken = (userInfo) =>
  jwt.sign({ userInfo }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15s" });

const createRefreshToken = (userInfo) =>
  jwt.sign({ userInfo }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" });

module.exports = { createAccessToken, createRefreshToken };
