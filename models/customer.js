const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  totalSpent: { type: Number, default: 0 },
  visits: { type: Number, default: 0 },
  lastVisit: { type: Date, default: null },
});

module.exports = mongoose.model("Customer", customerSchema);