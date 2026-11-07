require('dotenv').config();
const express = require('express');
const path = require('path');
const apiModule = require('./netlify/functions/api');

const app = express();
const PORT = process.env.PORT || 8888;

// Mount the API router
if (apiModule.app) {
    app.use(apiModule.app);
}

// Serve static frontend files
app.use(express.static(path.join(__dirname, '.')));

// Default route fallback to login.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.listen(PORT, () => {
    console.log(`[Kerala Fitness] Local server running at http://localhost:${PORT}`);
    console.log(`[Kerala Fitness] Access app at http://localhost:${PORT}/login.html`);
});
