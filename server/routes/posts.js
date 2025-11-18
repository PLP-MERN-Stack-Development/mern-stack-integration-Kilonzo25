const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  getPosts, getPost, createPost, updatePost, deletePost, addComment
} = require('../Controllers/postController');
const { protect } = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.get('/', getPosts);
router.get('/:id', getPost);
router.post('/', protect, upload.single('image'), createPost);
router.put('/:id', protect, upload.single('image'), updatePost);
router.delete('/:id', protect, deletePost);
router.post('/:postId/comments', protect, addComment);

module.exports = router;