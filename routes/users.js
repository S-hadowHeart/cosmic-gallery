var express = require('express');
var router = express.Router();
var User = require('../models/User');
const multer = require('multer');
const path = require('path');
const { isAuthenticated, isOwnProfile } = require('../middleware/auth');
const Post = require('../models/Post');
const fs = require('fs');
const Collection = require('../models/Collection');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/profiles')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

// Configure multer for post images
const postStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/posts')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload an image.'), false);
    }
  }
});

const uploadPost = multer({
  storage: postStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload an image.'), false);
    }
  }
});

// GET signup form
router.get('/signup', (req, res) => {
  res.render('signup');
});

// POST signup form
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('Email already registered');
    }

    const user = new User({ name, email, password });
    await user.save();
    req.session.userId = user._id;
    res.redirect(`/profile/${user._id}`);
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).send('Error during signup: ' + err.message);
  }
});

// GET login form
router.get('/login', (req, res) => {
  res.render('login');
});

// POST login form
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && await user.comparePassword(password)) {
      req.session.userId = user._id;
      res.redirect(`/profile/${user._id}`);
    } else {
      res.status(400).send('Invalid email or password');
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).send('Error during login: ' + err.message);
  }
});

// GET settings page
router.get('/settings', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.redirect('/login');
    }
    res.render('settings', { 
      user,
      messages: {
        error: req.flash('error'),
        success: req.flash('success')
      }
    });
  } catch (err) {
    console.error('Settings error:', err);
    res.status(500).send('Error loading settings: ' + err.message);
  }
});

// POST settings update
router.post('/settings', isAuthenticated, upload.single('profileImage'), async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.redirect('/login');
    }

    const { name, email, bio, currentPassword, newPassword, confirmPassword } = req.body;

    // Update basic info
    user.name = name;
    user.email = email;
    user.bio = bio;

    // Update profile image if uploaded
    if (req.file) {
      user.profileImage = req.file.filename;
    }

    // Update password if provided
    if (currentPassword && newPassword) {
      if (newPassword !== confirmPassword) {
        req.flash('error', 'New passwords do not match');
        return res.redirect('/settings');
      }

      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        req.flash('error', 'Current password is incorrect');
        return res.redirect('/settings');
      }

      user.password = newPassword;
    }

    await user.save();
    req.flash('success', 'Settings updated successfully');
    res.redirect('/settings');
  } catch (err) {
    console.error('Settings update error:', err);
    req.flash('error', 'Error updating settings: ' + err.message);
    res.redirect('/settings');
  }
});

// GET profile
router.get('/profile/:id', isAuthenticated, isOwnProfile, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Get user's posts with populated user info
    const posts = await Post.find({ user: req.params.id })
      .populate('user', 'name profileImage')
      .sort({ createdAt: -1 });

    // Get liked posts if it's the user's own profile
    let likedPosts = [];
    if (res.locals.isOwnProfile) {
      likedPosts = await Post.find({ likes: req.params.id })
        .populate('user', 'name profileImage')
        .sort({ createdAt: -1 });
    }

    // Get user's collections
    let collections = [];
    if (res.locals.isOwnProfile) {
      // If viewing own profile, show all collections
      collections = await Collection.find({ user: req.params.id })
        .populate('posts')
        .sort({ createdAt: -1 });
    } else {
      // If viewing other's profile, show only public collections
      collections = await Collection.find({ 
        user: req.params.id,
        isPrivate: false 
      })
      .populate('posts')
      .sort({ createdAt: -1 });
    }

    res.render('profile', { 
      user,
      posts,
      likedPosts,
      collections,
      isOwnProfile: res.locals.isOwnProfile
    });
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).send('Error loading profile: ' + err.message);
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

// GET create post page
router.get('/create-post', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    res.render('create-post', { 
      user,
      messages: {
        error: req.flash('error')
      }
    });
  } catch (err) {
    console.error('Create post error:', err);
    res.status(500).send('Error loading create post page: ' + err.message);
  }
});

// POST create post
router.post('/create-post', uploadPost.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      req.flash('error', 'Please upload an image');
      return res.redirect('/create-post');
    }

    const { title, caption, tags } = req.body;
    
    // Process tags - split by comma and trim whitespace
    const processedTags = tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

    const post = new Post({
      user: req.session.userId,
      title,
      caption,
      image: req.file.filename,
      tags: processedTags
    });

    await post.save();
    res.redirect('/profile/' + req.session.userId);
  } catch (err) {
    console.error('Error creating post:', err);
    req.flash('error', 'Error creating post. Please try again.');
    res.redirect('/create-post');
  }
});

// Delete post route
router.post('/delete-post/:id', isAuthenticated, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    // Check if post exists and belongs to user
    if (!post) {
      req.flash('error', 'Post not found');
      return res.redirect('/');
    }
    
    if (post.user.toString() !== req.session.userId) {
      req.flash('error', 'Not authorized to delete this post');
      return res.redirect('/');
    }

    // Delete the image file
    const imagePath = path.join(__dirname, '../public/uploads/posts', post.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await Post.findByIdAndDelete(req.params.id);
    req.flash('success', 'Post deleted successfully');
    res.redirect('/profile/' + req.session.userId);
  } catch (err) {
    console.error('Error deleting post:', err);
    req.flash('error', 'Error deleting post');
    res.redirect('/');
  }
});

// Edit post page
router.get('/edit-post/:id', isAuthenticated, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      req.flash('error', 'Post not found');
      return res.redirect('/');
    }
    
    if (post.user.toString() !== req.session.userId) {
      req.flash('error', 'Not authorized to edit this post');
      return res.redirect('/');
    }

    res.render('edit-post', { 
      post,
      user: await User.findById(req.session.userId),
      messages: {
        error: req.flash('error')
      }
    });
  } catch (err) {
    console.error('Error loading edit post page:', err);
    req.flash('error', 'Error loading post');
    res.redirect('/');
  }
});

// Update post route
router.post('/edit-post/:id', isAuthenticated, upload.single('image'), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      req.flash('error', 'Post not found');
      return res.redirect('/');
    }
    
    if (post.user.toString() !== req.session.userId) {
      req.flash('error', 'Not authorized to edit this post');
      return res.redirect('/');
    }

    const { title, caption, tags } = req.body;
    
    // Process tags
    const processedTags = tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

    // Update post fields
    post.title = title;
    post.caption = caption;
    post.tags = processedTags;

    // If new image uploaded, delete old one and update
    if (req.file) {
      const oldImagePath = path.join(__dirname, '../public/uploads/posts', post.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      post.image = req.file.filename;
    }

    await post.save();
    req.flash('success', 'Post updated successfully');
    res.redirect('/profile/' + req.session.userId);
  } catch (err) {
    console.error('Error updating post:', err);
    req.flash('error', 'Error updating post');
    res.redirect('/edit-post/' + req.params.id);
  }
});

// Get post details
router.get('/post/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user', 'name profileImage')
      .populate('comments.user', 'name profileImage');

    if (!post) {
      req.flash('error', 'Post not found');
      return res.redirect('/');
    }

    // Get similar posts based on tags
    let similarPosts = [];
    if (post.tags && post.tags.length > 0) {
      similarPosts = await Post.find({
        _id: { $ne: post._id }, // Exclude current post
        tags: { $in: post.tags }
      })
      .populate('user', 'name profileImage')
      .sort({ createdAt: -1 })
      .limit(4); // Limit to 4 similar posts
    }

    // Get user's collections if logged in
    let collections = [];
    if (req.session.userId) {
      collections = await Collection.find({ user: req.session.userId });
    }

    res.render('post-details', {
      post,
      similarPosts,
      user: req.session.userId ? await User.findById(req.session.userId) : null,
      collections
    });
  } catch (err) {
    console.error('Error loading post:', err);
    req.flash('error', 'Error loading post');
    res.redirect('/');
  }
});

// Like/Unlike post
router.post('/like/:id', isAuthenticated, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const likeIndex = post.likes.indexOf(req.session.userId);
    
    if (likeIndex === -1) {
      // Like the post
      post.likes.push(req.session.userId);
    } else {
      // Unlike the post
      post.likes.splice(likeIndex, 1);
    }

    await post.save();
    res.redirect('back');
  } catch (err) {
    console.error('Error liking/unliking post:', err);
    res.status(500).json({ error: 'Error processing like' });
  }
});

// Add comment
router.post('/comment/:id', isAuthenticated, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      req.flash('error', 'Post not found');
      return res.redirect('/');
    }

    const { content } = req.body;
    
    post.comments.push({
      user: req.session.userId,
      content
    });

    await post.save();
    res.redirect('back');
  } catch (err) {
    console.error('Error adding comment:', err);
    req.flash('error', 'Error adding comment');
    res.redirect('back');
  }
});

// Get collections page
router.get('/collections', isAuthenticated, async (req, res) => {
  try {
    const collections = await Collection.find({ user: req.session.userId })
      .populate('posts')
      .sort({ createdAt: -1 });

    res.render('collections', {
      user: await User.findById(req.session.userId),
      collections
    });
  } catch (err) {
    console.error('Error loading collections:', err);
    req.flash('error', 'Error loading collections');
    res.redirect('/');
  }
});

// Create new collection
router.post('/collections', isAuthenticated, async (req, res) => {
  try {
    const { name, description, isPrivate } = req.body;
    
    const collection = new Collection({
      name,
      description,
      isPrivate: isPrivate === 'on',
      user: req.session.userId
    });

    await collection.save();
    req.flash('success', 'Collection created successfully');
    res.redirect('/collections');
  } catch (err) {
    console.error('Error creating collection:', err);
    req.flash('error', 'Error creating collection');
    res.redirect('/collections');
  }
});

// Get collection details
router.get('/collection/:id', async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id)
      .populate('user', 'name profileImage')
      .populate({
        path: 'posts',
        populate: {
          path: 'user',
          select: 'name profileImage'
        }
      });

    if (!collection) {
      req.flash('error', 'Collection not found');
      return res.redirect('/');
    }

    // Check if collection is private and user is not the owner
    if (collection.isPrivate && (!req.session.userId || collection.user._id.toString() !== req.session.userId.toString())) {
      req.flash('error', 'This collection is private');
      return res.redirect('/');
    }

    const isOwner = req.session.userId && collection.user._id.toString() === req.session.userId.toString();

    res.render('collection-details', {
      collection,
      user: req.session.userId ? await User.findById(req.session.userId) : null,
      isOwner
    });
  } catch (err) {
    console.error('Error loading collection:', err);
    req.flash('error', 'Error loading collection');
    res.redirect('/');
  }
});

// Update collection
router.post('/collections/:id', isAuthenticated, async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    
    if (!collection) {
      req.flash('error', 'Collection not found');
      return res.redirect('/collections');
    }

    if (collection.user.toString() !== req.session.userId) {
      req.flash('error', 'Not authorized to edit this collection');
      return res.redirect('/collections');
    }

    const { name, description, isPrivate } = req.body;
    
    collection.name = name;
    collection.description = description;
    collection.isPrivate = isPrivate === 'on';

    await collection.save();
    req.flash('success', 'Collection updated successfully');
    res.redirect('/collection/' + collection._id);
  } catch (err) {
    console.error('Error updating collection:', err);
    req.flash('error', 'Error updating collection');
    res.redirect('/collections');
  }
});

// Delete collection
router.post('/delete-collection/:id', isAuthenticated, async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    
    if (!collection) {
      req.flash('error', 'Collection not found');
      return res.redirect('/collections');
    }

    if (collection.user.toString() !== req.session.userId) {
      req.flash('error', 'Not authorized to delete this collection');
      return res.redirect('/collections');
    }

    await Collection.findByIdAndDelete(req.params.id);
    req.flash('success', 'Collection deleted successfully');
    res.redirect('/collections');
  } catch (err) {
    console.error('Error deleting collection:', err);
    req.flash('error', 'Error deleting collection');
    res.redirect('/collections');
  }
});

// Save post to collection
router.post('/save-post/:postId', isAuthenticated, async (req, res) => {
  try {
    const { collectionId } = req.body;
    const postId = req.params.postId;

    const collection = await Collection.findById(collectionId);
    if (!collection) {
      req.flash('error', 'Collection not found');
      return res.redirect('back');
    }

    if (collection.user.toString() !== req.session.userId) {
      req.flash('error', 'Not authorized to save to this collection');
      return res.redirect('back');
    }

    // Check if post is already in collection
    if (collection.posts.includes(postId)) {
      req.flash('error', 'Post is already in this collection');
      return res.redirect('back');
    }

    collection.posts.push(postId);
    await collection.save();

    req.flash('success', 'Post saved to collection');
    res.redirect('back');
  } catch (err) {
    console.error('Error saving post:', err);
    req.flash('error', 'Error saving post');
    res.redirect('back');
  }
});

// Remove post from collection
router.post('/unsave-post/:postId', isAuthenticated, async (req, res) => {
  try {
    const { collectionId } = req.body;
    const postId = req.params.postId;

    const collection = await Collection.findById(collectionId);
    if (!collection) {
      req.flash('error', 'Collection not found');
      return res.redirect('back');
    }

    if (collection.user.toString() !== req.session.userId) {
      req.flash('error', 'Not authorized to modify this collection');
      return res.redirect('back');
    }

    collection.posts = collection.posts.filter(post => post.toString() !== postId);
    await collection.save();

    req.flash('success', 'Post removed from collection');
    res.redirect('back');
  } catch (err) {
    console.error('Error removing post:', err);
    req.flash('error', 'Error removing post');
    res.redirect('back');
  }
});

module.exports = router;
