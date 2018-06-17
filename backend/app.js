const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/users');

const app = express();

// temporarypassword
// mongoose.connect('mongodb+srv://tbuckner:temporarypassword@cluster0-2jqk7.mongodb.net/test?retryWrites=true') // FIXME: Removed query params to avoid cyclic error in Mongo
// More Info: https://github.com/Automattic/mongoose/issues/6109
mongoose.connect('mongodb+srv://tbuckner:temporarypassword@cluster0-2jqk7.mongodb.net/test') // TODO: Replace test with correct DB name.
  .then(() => {
    console.log('Connected to Database...');
  })
  .catch(() => {
    console.log('Connection to Database failed.');
  });

app.use(bodyParser.json());
app.use('/images', express.static(path.join('backend/images'))); // Forward /images to /backend/images

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  setTimeout(() => {
    next();
  }, 500); // For testing loading
});

app.use('/api/posts', postsRoutes);
app.use('/api/users', userRoutes);

module.exports = app;
