const User = require('../models/User');

// Middleware to check if user is logged in
const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  res.redirect('/login');
};

// Middleware to check if user is accessing their own profile
const isOwnProfile = async (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  
  const profileId = req.params.id;
  if (req.session.userId === profileId) {
    res.locals.isOwnProfile = true;
  } else {
    res.locals.isOwnProfile = false;
  }
  next();
};

module.exports = {
  isAuthenticated,
  isOwnProfile
}; 