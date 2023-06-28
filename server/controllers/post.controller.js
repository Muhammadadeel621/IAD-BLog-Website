const PostModel = require('../models/post.model');
const path = require('path');
const fsPromises = require('fs').promises;

const getAllPostsStatic = async (req, res) => {
  const posts = await PostModel.find().populate('author', ['username']).sort({ createdAt: -1 }).limit(6);

  res.status(200).json({ posts });
};

const getAllPosts = async (req, res) => {
  const latest = req.query.latest === 'false' ? false : true;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 12;
  const skip = (page - 1) * limit;
  const userId = req.query.userId || null;

  const posts = await PostModel.find({
    ...(userId && { author: userId }),
  })
    .populate('author', ['username'])
    .sort({ createdAt: latest ? -1 : 1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json({ posts, numHits: posts.length });
};

const getPostById = async (req, res) => {
  const { id } = req.params;
  const post = await PostModel.findById(id).populate('author', ['username']).limit(1);
  return res.status(200).json({ post });
};

const createPost = async (req, res) => {
  const { title, summary, content } = req.body;
  const { userId } = req;
  const path = req.filePath;

  const post = await PostModel.create({
    title,
    summary,
    content,
    cover: path,
    author: userId,
  });

  return res.status(201).json({ post });
};

const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, summary, content } = req.body;

  try {
    const post = await PostModel.findById(id);

    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.author._id.toString() !== req.userId) return res.status(401).json({ message: 'Unauthorized' });

    post.title = title;
    post.summary = summary;
    post.content = content;

    await post.save();

    return res.status(200).json({ post });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await PostModel.findById(id);

    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.author._id.toString() !== req.userId) return res.status(401).json({ message: 'Unauthorized' });

    // remove picture from uploads
    if (post.cover) await fsPromises.unlink(path.join(__dirname, '..', 'public', post.cover));

    await post.deleteOne();

    return res.status(200).json({ message: 'Post deleted successfully' });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

module.exports = { getAllPosts, getPostById, createPost, updatePost, deletePost, getAllPostsStatic };
