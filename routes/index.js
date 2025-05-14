var express = require('express');
var router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');

/* GET home page. */
router.get('/', async function(req, res, next) {
  try {
    const query = req.query.q;
    const tag = req.query.tag;
    let searchQuery = {};

    // Build search query
    if (query) {
      searchQuery = {
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { caption: { $regex: query, $options: 'i' } },
          { tags: { $regex: query, $options: 'i' } }
        ]
      };
    }

    // Add tag filter if specified
    if (tag) {
      searchQuery.tags = tag;
    }

    // Get posts with user information
    const posts = await Post.find(searchQuery)
      .populate('user', 'name profileImage')
      .sort({ createdAt: -1 })
      .limit(20);

    // Get popular tags for the filter bar
    const popularTags = await Post.aggregate([
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $project: { _id: 0, tag: '$_id' } }
    ]);

    res.render('index', { 
      posts,
      user: req.session.userId ? await User.findById(req.session.userId) : null,
      query,
      tag,
      popularTags: popularTags.map(t => t.tag)
    });
  } catch (err) {
    console.error('Error fetching posts:', err);
    next(err);
  }
});

module.exports = router;
