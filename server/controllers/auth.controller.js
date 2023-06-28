const UserModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const { createAccessToken, createRefreshToken } = require('../lib/createJWT');
const { options: cookieOptions, maxAge } = require('../config/cookieOptions');

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd) return res.status(400).json({ message: 'Username and password are required.' });

  const foundUser = await UserModel.findOne({ username: user }).exec();

  if (!foundUser) return res.status(401).json({ message: 'Invalid credentials.' });

  // evaluate password
  const match = await bcrypt.compare(pwd, foundUser.password);

  if (!match) return res.status(401).json({ message: 'Invalid credentials.' });

  const accessToken = createAccessToken({ username: foundUser.username, _id: foundUser._id });

  const refreshToken = createRefreshToken({ username: foundUser.username });

  // Saving refreshToken with current user
  foundUser.refreshToken = refreshToken;
  const result = await foundUser.save();

  // Creates Secure Cookie with refresh token
  res.cookie('jwt', refreshToken, { ...cookieOptions, maxAge });

  // Send authorization roles and access token to user
  res.json({ accessToken, user: { username: foundUser.username } });
};

module.exports = { handleLogin };
