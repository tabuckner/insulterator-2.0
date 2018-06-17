const express = require('express');
const multer = require('multer');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
};

const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type.');
    if (isValid) {
      error = null;
    }
    cb(error, 'backend/images'); // (error, Relative path)
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    const newFileName = `${name}-${Date.now()}.${ext}`;
    cb(null, `${name}-${Date.now()}.${ext}`);
  }
});

/**
 * MODELS
 */
const Post = require('../models/post');

/**
 * MIDDLEWARE
 */
const checkAuth = require('../middleware/check-auth');

router.post('', checkAuth, multer({storage: storageConfig}).single('image'), (req, res, next) => {
  const url = `${req.protocol}://${req.get('host')}`
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: `${url}/images/${req.file.filename}`
  });
  post.save().then(createdPost => {
    console.log(post);
    res.status(201).json({
      message: 'Post added successfully.',
      post: {
        ...createdPost,
        id: createdPost._id
      }
    });
  });
});

router.patch('/:id', checkAuth, multer({storage: storageConfig}).single('image'), (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = `${req.protocol}://${req.get('host')}`
    imagePath = `${url}/images/${req.file.filename}`
  }
  const updatedPost = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  });
  Post.updateOne( { _id: req.params.id }, updatedPost)
    .then(result => {
      console.log(result.nModified);
      if (result.nModified === 1) {
      return res.status(200).json({
          message: 'Updated post successfully',
        });
      }
      if (result.nModified === 0 && result.n === 1) {
        return res.status(200).json({
          message: 'No changes requested.',
        });
      }
      if (result.n === 0) {
        return res.status(404).json({
          message: 'No mataches found.',
        });
      }
    });
});

router.get('', (req, res, next) => {
  console.log(req.query);
  const pageSize = +req.query.pagesize; // Convert to numbers
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) { // page 0?
    const elemToSkip = pageSize * (currentPage - 1);
    postQuery // Inefficient for Large Data Sets
      .skip(elemToSkip)
      .limit(pageSize)
  }
  postQuery
    .then((docs) => {
      fetchedPosts = docs;
      return Post.count();
    })
    .then((count) => {
      console.log(fetchedPosts);
      res.status(200).json({
        message: 'Posts fetched successfully.',
        posts: fetchedPosts,
        totalPosts: count
      });
    });
});

router.delete('/:id', checkAuth, (req, res, next) => {
  const id = req.params.id;
  console.log(`Attempting to delete post: ${id}`);
  Post.deleteOne({ _id: id })
    .then(() => {
      res.status(200).json({
        message: `Post ${id} deleted.`
      });
    });
});

router.get('/:id', (req, res, next) => {
  const id = req.params.id
  Post.findById(id).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({
        message: 'Post not found.'
      });
    }
  });
});

module.exports = router;
