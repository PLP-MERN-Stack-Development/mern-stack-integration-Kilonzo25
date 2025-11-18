const Post = require('../models/Post');
const Comment = require('../models/Comment');

const getPosts = async (req, res) => {
  const { page = 1, limit = 5, search, category } = req.query;
  const query = {};
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } }
    ];
  }
  if (category) query.category = category;

  const posts = await Post.find(query)
    .populate('category', 'name')
    .populate('author', 'username')
    .limit(limit)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  const total = await Post.countDocuments(query);

  res.json({
    posts,
    pagination: { page: +page, limit: +limit, total, pages: Math.ceil(total / limit) }
  });
};

const getPost = async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate('category', 'name')
    .populate('author', 'username')
    .populate({
      path: 'comments',
      populate: { path: 'author', select: 'username' }
    });
  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.json(post);
};

const createPost = async (req, res) => {
  const { title, content, category } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;
  const post = await Post.create({
    title, content, category, image,
    author: req.user._id
  });
  const populated = await Post.findById(post._id)
    .populate('category', 'name')
    .populate('author', 'username');
  res.status(201).json(populated);
};

const updatePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post.author.toString() !== req.user._id.toString()) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  const image = req.file ? `/uploads/${req.file.filename}` : post.image;
  const updated = await Post.findByIdAndUpdate(
    req.params.id,
    { ...req.body, image },
    { new: true }
  ).populate('category author');
  res.json(updated);
};

const deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post.author.toString() !== req.user._id.toString()) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  await Post.findByIdAndDelete(req.params.id);
  res.json({ message: 'Post deleted' });
};

const addComment = async (req, res) => {
  const { text } = req.body;
  const comment = await Comment.create({
    text,
    post: req.params.postId,
    author: req.user._id
  });
  await Post.findByIdAndUpdate(req.params.postId, { $push: { comments: comment._id } });
  const populated = await Comment.findById(comment._id).populate('author', 'username');
  res.status(201).json(populated);
};

module.exports = { getPosts, getPost, createPost, updatePost, deletePost, addComment };