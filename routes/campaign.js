const express = require("express");
const router = express.Router();
const Campaign = require("../models/campaign");
const AudienceSegment = require("../models/audienceSegment");

// GET: Show Campaign Creation Page
router.get("/create", async (req, res) => {
    try {
        const segments = await AudienceSegment.find().sort({ createdAt: -1 });
        res.render("createCampaign", { segments });
    } catch (err) {
        console.error("Error loading campaign creation page:", err.message);
        res.redirect("/dashboard");
    }
});

// POST: Create a New Campaign
router.post("/create", async (req, res) => {
    try {
        const { name, segmentId, messageTemplate } = req.body;

        if (!name || !segmentId || !messageTemplate) {
            return res.status(400).send("All fields are required.");
        }

        const campaign = new Campaign({ name, segmentId, messageTemplate });
        await campaign.save();

        res.redirect("/campaigns/history");
    } catch (err) {
        console.error("Error creating campaign:", err.message);
        res.status(500).send("Internal Server Error");
    }
});

// GET: View Campaign History
router.get("/history", async (req, res) => {
    try {
        const campaigns = await Campaign.find()
            .populate("segmentId", "name size") // Populate the correct path
            .sort({ createdAt: -1 });

        res.render("campaignHistory", { campaigns });
    } catch (err) {
        console.error("Error fetching campaign history:", err.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
