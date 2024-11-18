const mongoose = require('mongoose');

const communicationLogSchema = new mongoose.Schema({
  audienceId: mongoose.Schema.Types.ObjectId, // Reference to an Audience Segment or related entity
  name: String, // Name of the person in the audience
  message: String, // Personalized message
  status: { type: String, enum: ['PENDING', 'SENT', 'FAILED'], default: 'PENDING' },
  deliveryStatus: { type: String, enum: ['DELIVERED', 'NOT_DELIVERED'], default: null },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CommunicationLog', communicationLogSchema);
