const express = require("express");
const router = express.Router();
const Customer = require("../models/customer");
const Order = require("../models/order");

// Create or update a customer
router.post("/customer", async (req, res) => {
    try {
        const { name, email, phone } = req.body;

        if (!name || !email || !phone) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Check if the customer exists, update if found
        let customer = await Customer.findOne({ email });
        if (customer) {
            customer.phone = phone;
            await customer.save();
            return res.status(200).json({ message: "Customer updated", customer });
        }

        // Create a new customer
        customer = new Customer({ name, email, phone });
        await customer.save();
        res.status(201).json({ message: "Customer created", customer });
    } catch (err) {
        res.status(500).json({ message: "Error saving customer", error: err.message });
    }
});

// Add a new order
router.post("/order", async (req, res) => {
    try {
        const { customerId, amount } = req.body;

        if (!customerId || !amount) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Verify customer exists
        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        // Create a new order
        const order = new Order({ customerId, amount });
        await order.save();

        // Update customer totalSpent and visits
        customer.totalSpent += amount;
        customer.visits += 1;
        customer.lastVisit = new Date();
        await customer.save();

        res.status(201).json({ message: "Order created", order });
    } catch (err) {
        res.status(500).json({ message: "Error saving order", error: err.message });
    }
});

module.exports = router;
