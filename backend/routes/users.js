const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

/**
 * MODELS
 */
const User = require('../models/user');

router.post('/signup', (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(result => {
          res.status(201).json({
            message: 'User successfully created.',
            result: result
          });
        })
        .catch(err => {
          res.status(500).json({
            message: 'Invalid authentication credentials were used.'
          });
        });
    });
});

router.post('/login', (req, res, next) => {
  let fetchedUser;
  User.findOne({
      email: req.body.email
    })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: 'Auth Failed.'
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: 'Auth Failed.'
        });
      }
      // Create JWT
      const token = jwt.sign({
          email: fetchedUser.email, // Are Magick Dusts
          userId: fetchedUser._id // Are Magick Dusts
        },
        'temporary_secret_that_is_not_very_secure', {
          expiresIn: '1h'
        }
      )
      res.status(200).json({
        message: 'Auth successful.',
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id
      })
    })
    .catch(err => {
      return res.status(401).json({
        message: 'Auth Failed.'
      });
    });
});

module.exports = router;
