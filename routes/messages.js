const express = require('express');
const router = express.Router();
const CommunicationLog = require('../models/communicationLog');
const fetch = require('node-fetch'); // Ensure this is installed using `npm install node-fetch`

// Dummy API to send personalized messages
router.post('/send-messages', async (req, res) => {
  try {
    const { audience } = req.body; // Array of audience objects [{ name, audienceId }]
    const logs = [];

    if (!audience || !Array.isArray(audience)) {
      return res.status(400).json({ error: 'Invalid audience data provided.' });
    }

    // Create logs and simulate sending messages
    for (const person of audience) {
      if (!person.name || !person.audienceId) {
        return res.status(400).json({ error: 'Each audience member must have a name and audienceId.' });
      }

      const message = `Hi ${person.name}, here’s 10% off on your next order!`;
      const log = await CommunicationLog.create({
        audienceId: person.audienceId,
        name: person.name,
        message,
        deliveryStatus: 'PENDING', // Ensure the default status is set
      });

      logs.push(log);

      // Call Delivery Receipt API
      try {
        await fetch(`${process.env.APP_URL}/api/messages/delivery-receipt/${log._id}`, {
          method: 'POST',
        });
      } catch (error) {
        console.error(`Error calling Delivery Receipt API for log ID ${log._id}:`, error.message);
      }
    }

    res.status(200).json({ message: 'Messages are being sent.', logs });
  } catch (error) {
    console.error('Error sending messages:', error);
    res.status(500).json({ error: 'Failed to send messages.' });
  }
});

// Delivery Receipt API
router.post('/delivery-receipt/:id', async (req, res) => {
  try {
    const logId = req.params.id;

    // Simulate delivery status (90% SENT, 10% FAILED)
    const isSent = Math.random() < 0.9; // 90% chance of being SENT
    const status = isSent ? 'SENT' : 'FAILED';

    // Update the communication log
    const log = await CommunicationLog.findByIdAndUpdate(
      logId,
      { deliveryStatus: status },
      { new: true } // Return the updated document
    );

    if (!log) {
      return res.status(404).json({ error: 'Communication log not found.' });
    }

    res.status(200).json({ message: `Message ${status}`, log });
  } catch (error) {
    console.error('Error updating delivery status:', error);
    res.status(500).json({ error: 'Failed to update delivery status.' });
  }
});

module.exports = router;
