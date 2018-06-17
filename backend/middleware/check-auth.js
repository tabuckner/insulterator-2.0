const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try{
    const token = req.headers.authorization.split('Bearer ')[1];
    jwt.verify(token, 'temporary_secret_that_is_not_very_secure');
    next();
  } catch (error) {
    res.status(401).json({
      message: 'Auth failed.'
    });
  }

}
