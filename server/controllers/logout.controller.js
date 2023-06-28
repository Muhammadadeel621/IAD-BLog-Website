const UserModel = require('../models/user.model');
const { options: cookieOptions } = require('../config/cookieOptions');

const handleLogout = async (req, res) => {
  // On client, also delete the accessToken

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content

  const refreshToken = cookies.jwt;

  // Is refreshToken in db?
  const foundUser = await UserModel.findOne({ refreshToken }).exec();
  if (!foundUser) {
    res.clearCookie('jwt', cookieOptions);
    res.sendStatus(204);
  }

  // Delete refreshToken in db
  foundUser.refreshToken = '';
  const result = await foundUser.save();

  res.clearCookie('jwt', cookieOptions);
  res.sendStatus(204);
};

module.exports = { handleLogout };
