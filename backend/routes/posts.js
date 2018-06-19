const express = require('express');

/**
 * CONTROLLERS
 */
const PostController = require('../controllers/post');

/**
 * MIDDLEWARE
 */
const checkAuth = require('../middleware/check-auth');
const extractImage = require('../middleware/extract-image');

const router = express.Router();

router.post('', checkAuth, extractImage, PostController.createPost);
router.patch('/:id', checkAuth, extractImage, PostController.updatePost);
router.get('', PostController.getPosts);
router.get('/:id', PostController.getPost);
router.delete('/:id', checkAuth, PostController.deletePost);

module.exports = router;
