const mongoose = require('mongoose');

const communicationLogSchema = new mongoose.Schema({
  audienceId: { type: String, required: true },
  name: { type: String, required: true },
  message: { type: String, required: true },
  deliveryStatus: {
    type: String,
    enum: ['PENDING', 'SENT', 'FAILED'],
    default: 'PENDING', // Set default value to 'PENDING'
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CommunicationLog', communicationLogSchema);
