const UserModel = require('../models/user.model');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd) return res.status(400).json({ message: 'Username and password are required.' });

  // check for duplicate usernames in the db
  const duplicate = await UserModel.findOne({ username: user }).exec();

  if (duplicate) return res.status(409).json({ message: 'Username already exists.' });

  try {
    //encrypt the password
    const hashedPwd = await bcrypt.hash(pwd, 10);

    //create and store the new user
    const result = await UserModel.create({
      username: user,
      password: hashedPwd,
    });

    res.status(201).json({ message: `New user ${user} created!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
