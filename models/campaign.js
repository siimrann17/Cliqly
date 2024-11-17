const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Campaign name
    segmentId: { type: mongoose.Schema.Types.ObjectId, ref: "AudienceSegment", required: true }, // Correct reference
    messageTemplate: { type: String, required: true }, // Message template
    sentCount: { type: Number, default: 0 }, // Total messages sent
    failedCount: { type: Number, default: 0 }, // Total messages failed
    createdAt: { type: Date, default: Date.now }, // Creation date
});

module.exports = mongoose.model("Campaign", campaignSchema);
