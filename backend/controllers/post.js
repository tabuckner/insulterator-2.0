/**
 * MODELS
 */
const Post = require('../models/post');

exports.createPost = (req, res, next) => {
  const url = `${req.protocol}://${req.get('host')}`
  console.log(req.body);
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    // imagePath: `${url}/images/${req.file.filename}`,
    // imagePath: null,
    creator: req.userData.userId // The Fire for The Magic Cauldron
  });
  console.log(post);
  post.save()
    .then(createdPost => {
      console.log(post);
      res.status(201).json({
        message: 'Post added successfully.',
        post: {
          ...createdPost,
          id: createdPost._id
        }
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Creating a post has failed.'
      });
    });
};

exports.updatePost = (req, res, next) => {
  // let imagePath = req.body.imagePath;
  // if (req.file) {
  //   const url = `${req.protocol}://${req.get('host')}`
  //   imagePath = `${url}/images/${req.file.filename}`
  // }
  const updatedPost = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    // imagePath: imagePath,
    creator: req.userData.userId
  });
  Post.updateOne({
      _id: req.params.id,
      creator: req.userData.userId
    }, updatedPost)
    .then(result => {
      console.log(result.nModified);
      if (result.nModified > 0) {
        return res.status(200).json({
          message: 'Updated post successfully.',
        });
      }
      if (result.nModified === 0 && result.n === 1) {
        return res.status(200).json({
          message: 'No changes requested.',
        });
      }
      if (result.n === 0) {
        return res.status(401).json({
          message: 'Not Authorized.',
        });
      }
    })
    .catch(error => {
      res.status(500).json({
        messge: 'Couldn\'t update post.'
      });
    });
};

exports.getPosts = (req, res, next) => {
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
    })
    .catch(error => {
      res.status(500).json({
        message: 'Fetching posts failed.'
      });
    });
};

exports.getPost = (req, res, next) => {
  const id = req.params.id
  Post.findById(id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({
          message: 'Post not found.'
        });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: 'Fetching posts failed.'
      });
    });;
};

exports.deletePost = (req, res, next) => {
  const id = req.params.id;
  console.log(`Attempting to delete post: ${id}`);
  Post.deleteOne({
      _id: id,
      creator: req.userData.userId
    })
    .then((result) => {
      console.log(result);
      if (result.n > 0) {
        res.status(200).json({
          message: `Post successfully deleted.`
        });
      } else {
        res.status(401).json({
          message: 'Not Authorized.',
        });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: 'Unable to delete post.'
      });
    });
};
