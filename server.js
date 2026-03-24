const express = require('express');
const path = require('path');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ VERY IMPORTANT (serve HTML, CSS, JS)
app.use(express.static(__dirname));

// Temporary storage (you can replace with DB later)
let messages = [];

// Route to save message
app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;

    const newMessage = {
        id: messages.length + 1,
        name,
        email,
        message,
        created_at: new Date()
    };

    messages.push(newMessage);

    res.json({ success: true });
});

// Route to get all messages
app.get('/messages', (req, res) => {
    res.json(messages);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});