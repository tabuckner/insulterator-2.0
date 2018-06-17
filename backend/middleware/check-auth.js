const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => { // Are Magick Cauldron
  try{
    const token = req.headers.authorization.split('Bearer ')[1];
    const decodedToken = jwt.verify(token, 'temporary_secret_that_is_not_very_secure');
    req.userData = { email: decodedToken.email, userId: decodedToken.userId };
    next();
  } catch (error) {
    res.status(401).json({
      message: 'You are not authenticated.'
    });
  }

}
