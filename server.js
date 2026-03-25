const express = require('express');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend files
app.use(express.static(__dirname));

// Store messages (temporary)
let messages = [];

// POST route (form submit)
app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;

    console.log("New Message:");
    console.log(name, email, message);

    messages.push({ name, email, message });

    res.json({ success: true });
});

// GET route (view messages)
app.get('/messages', (req, res) => {
    res.json(messages);
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});