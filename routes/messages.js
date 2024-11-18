const express = require('express');
const router = express.Router();
const CommunicationLog = require('../models/communicationLog');

// Dummy API to send personalized messages
router.post('/send-messages', async (req, res) => {
  try {
    const { audience } = req.body; // Array of audience objects [{ name, audienceId }]
    const logs = [];

    // Create logs and simulate sending messages
    for (const person of audience) {
      const message = `Hi ${person.name}, here’s 10% off on your next order!`;
      const log = await CommunicationLog.create({
        audienceId: person.audienceId,
        name: person.name,
        message,
      });

      logs.push(log);

      // Call Delivery Receipt API
      await fetch(`${process.env.APP_URL}/api/messages/delivery-receipt/${log._id}`, {
        method: 'POST',
      });
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
    const deliveryStatus = isSent ? 'DELIVERED' : 'NOT_DELIVERED';

    // Update the communication log
    await CommunicationLog.findByIdAndUpdate(logId, {
      status,
      deliveryStatus,
    });

    res.status(200).json({ message: `Message ${status}`, deliveryStatus });
  } catch (error) {
    console.error('Error updating delivery status:', error);
    res.status(500).json({ error: 'Failed to update delivery status.' });
  }
});

module.exports = router;
