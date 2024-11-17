const express = require('express');
const router = express.Router();
const Request = require('../models/request');
const User = require('../models/user');
const AudienceSegment = require('../models/audienceSegment');
const { isAuthenticated } = require('../middleware');
const Campaign = require("../models/campaign");

// List all requests & audience segments
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const user = req.user;
    const users = await User.find({}, '_id name profileImage');
    let requests;

    // Handle search queries for requests
    if (req.query.q) {
      requests = await Request.find({ name: { $regex: new RegExp(req.query.q, 'i') } }).populate('owner', '_id name profileImage');
    } else {
      requests = await Request.find().populate('owner', '_id name profileImage');
    }

    // Fetch audience segments
    const segments = await AudienceSegment.find().sort({ createdAt: -1 });

    // Fetch campaigns and populate the correct field (segmentId)
    const campaigns = await Campaign.find().populate('segmentId', 'name size').sort({ createdAt: -1 });

    // Fetch notifications for the user
    const notifications = user.notifications;
    const unreadNotificationCount = notifications.filter(notification => !notification.read).length;

    // Pass requests, users, segments, campaigns, and notification count to the dashboard view
    res.render('dashboard', { requests, users, segments, campaigns, unreadNotificationCount });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


// Create a new request
router.get('/create', isAuthenticated, async (req, res) => {
  try {
    const users = await User.find({}, '_id name');
    res.render('create', { users });
  } catch (error) {
    console.error(error);
    res.redirect('/dashboard');
  }
});

router.post('/create', isAuthenticated, async (req, res) => {
  try {
    const { type, name, tag, owner, deadline, status } = req.body;
    const existingRequests = await Request.find();
    const id = existingRequests.length + 1;

    const request = new Request({ id, type, name, tag, owner, deadline, status });
    await request.save();

    // Create a notification for the owner
    const ownerUser = await User.findById(owner);
    if (ownerUser) {
      ownerUser.notifications.push({
        message: `You have been assigned a new ${type}: ${name}`,
        type: 'request',
        data: {
          requestId: request._id,
        },
      });
      await ownerUser.save();
    }

    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Edit a request
router.get('/:id/edit', isAuthenticated, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.redirect('/dashboard');
    }
    const users = await User.find({}, '_id name');
    res.render('edit', { request, users });
  } catch (error) {
    console.error(error);
    res.redirect('/dashboard');
  }
});

router.post('/:id/edit', isAuthenticated, async (req, res) => {
  try {
    const { type, name, tag, owner, deadline, status } = req.body;
    await Request.findByIdAndUpdate(req.params.id, {
      type,
      name,
      tag,
      owner,
      deadline,
      status,
    });
    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Delete a request
router.post('/:id/delete', isAuthenticated, async (req, res) => {
  try {
    await Request.findByIdAndDelete(req.params.id);
    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Search for requests dynamically
router.get('/search', isAuthenticated, async (req, res) => {
  try {
    const searchQuery = req.query.q;
    let requests;

    if (searchQuery) {
      requests = await Request.find({
        name: { $regex: new RegExp(searchQuery, 'i') },
      }).populate('owner', '_id name profileImage'); // Populate the owner field with user data
    } else {
      requests = await Request.find().populate('owner', '_id name profileImage'); // Populate the owner field with user data
    }

    // Respond with JSON data containing the search results
    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new audience segment
router.get('/segments/create', isAuthenticated, async (req, res) => {
  try {
    res.render('createSegment');
  } catch (error) {
    console.error(error);
    res.redirect('/dashboard');
  }
});

router.post('/segments/create', isAuthenticated, async (req, res) => {
  try {
    const { name, conditions } = req.body;

    if (!name || !conditions) {
      return res.status(400).send('Segment name and conditions are required.');
    }

    // Build a dynamic query from conditions
    const query = {};
    if (conditions.spending) query.totalSpent = { $gt: conditions.spending };
    if (conditions.visits) query.visits = { $lte: conditions.visits };
    if (conditions.inactivityDays) {
      const inactivityDate = new Date();
      inactivityDate.setDate(inactivityDate.getDate() - conditions.inactivityDays);
      query.lastVisit = { $lt: inactivityDate };
    }

    // Count customers matching the conditions
    const size = await Customer.countDocuments(query);

    // Create and save the audience segment
    const segment = new AudienceSegment({ name, conditions, size });
    await segment.save();

    res.redirect('/dashboard'); // Redirect back to the dashboard after creating
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Delete an audience segment
router.post('/segments/:id/delete', isAuthenticated, async (req, res) => {
  try {
    await AudienceSegment.findByIdAndDelete(req.params.id);
    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
