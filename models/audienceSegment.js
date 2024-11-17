const mongoose = require("mongoose");

const audienceSegmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    conditions: { type: Object, required: true },
    size: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("AudienceSegment", audienceSegmentSchema);
