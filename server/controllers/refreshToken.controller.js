const { createAccessToken } = require('../lib/createJWT');
const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;

  const foundUser = await UserModel.findOne({ refreshToken }).exec();

  if (!foundUser) return res.sendStatus(403); //Forbidden

  // evaluate jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.username !== decoded.userInfo.username) return res.sendStatus(403);
    const accessToken = createAccessToken({ username: foundUser.username, _id: foundUser._id });
    res.json({ accessToken, user: { username: foundUser.username } });
  });
};

module.exports = { handleRefreshToken };
