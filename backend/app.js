const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postsRoutes = require('./routes/posts');

const app = express();

// temporarypassword
mongoose.connect('mongodb+srv://tbuckner:temporarypassword@cluster0-2jqk7.mongodb.net/test?retryWrites=true') // TODO: Replace test with correct DB name.
  .then(() => {
    console.log('Connected to Database...');
  })
  .catch(() => {
    console.log('Connection to Database failed.');
  });

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  setTimeout(() => {
    next();
  }, 500); // For testing loading
});

app.use('/api/posts', postsRoutes);

module.exports = app;
