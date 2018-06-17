const express = require('express');

const router = express.Router();

/**
 * MODELS
 */
const Post = require('../models/post');

router.post('', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(createdPost => {
    console.log(post);
    res.status(201).json({
      message: 'Post added successfully.',
      postId: createdPost._id
    });
  });
});

router.patch('/:id', (req, res, next) => {
  const updatedPost = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content
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
  Post.find()
    .then((docs) => {
      console.log(docs);
      res.status(200).json({
        message: 'Posts fetched successfully.',
        posts: docs
      });
    });
});

router.delete('/:id', (req, res, next) => {
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
