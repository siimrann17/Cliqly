const express = require("express");
const router = express.Router();
const AudienceSegment = require("../models/audienceSegment");
const Customer = require("../models/customer");

// Create a new audience segment
router.post("/create", async (req, res) => {
    try {
        const { name, conditions } = req.body;

        if (!name || !conditions) {
            return res.status(400).send("Name and conditions are required.");
        }

        // Build the query dynamically based on conditions
        const query = {};
        if (conditions.spending) {
            query.totalSpent = { $gt: conditions.spending };
        }
        if (conditions.visits) {
            query.visits = { $lte: conditions.visits };
        }
        if (conditions.inactivityDays) {
            const inactivityDate = new Date();
            inactivityDate.setDate(inactivityDate.getDate() - conditions.inactivityDays);
            query.lastVisit = { $lt: inactivityDate };
        }

        // Count customers matching the conditions
        const size = await Customer.countDocuments(query);

        // Save the audience segment
        const segment = new AudienceSegment({ name, conditions, size });
        await segment.save();

        // Redirect back to the dashboard
        res.redirect("/dashboard");
    } catch (err) {
        console.error("Error:", err.message);
        res.status(500).send("Internal Server Error");
    }
});

// Fetch all audience segments
router.get("/", async (req, res) => {
    try {
        const segments = await AudienceSegment.find().sort({ createdAt: -1 });
        res.status(200).json({ segments });
    } catch (err) {
        res.status(500).json({ message: "Error fetching segments", error: err.message });
    }
});

// GET route to render the "Create Segment" page
router.get("/create", async (req, res) => {
    try {
        res.render("createSegment"); // Ensure createSegment.ejs exists
    } catch (error) {
        console.error("Error rendering create segment page:", error.message);
        res.redirect("/dashboard");
    }
});


module.exports = router;
