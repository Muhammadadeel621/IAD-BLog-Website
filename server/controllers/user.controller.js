const UserModal = require('../models/user.model');

const getAuthUserPosts = async (req, res) => {
  const urlSearchParams = new URLSearchParams(req.query);

  urlSearchParams.append('userId', req.userId);
  const query = urlSearchParams.toString();

  return res.redirect(`/api/posts?${query}`);
};

const getAllPostsByUsername = async (req, res) => {
  const urlSearchParams = new URLSearchParams(req.query);

  const user = await UserModal.findOne({ username: req.params.username });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  urlSearchParams.append('userId', user._id);
  const query = urlSearchParams.toString();

  return res.redirect(`/api/posts?${query}`);
};

module.exports = { getAuthUserPosts, getAllPostsByUsername };
