const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const db = require('../../database');
const serverless = require('serverless-http');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

const app = express();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// RULE 2: Multer memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Middleware
app.use(cors()); // Allow frontend to communicate
app.use(bodyParser.json());
// Note: Static files are served by Netlify now

// Routes

// Sign-Up Route
app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).send("Username, email, and password are required.");
    }

    try {
        // 1. Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 2. Save to DB
        const query = 'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)';
        db.run(query, [username, email, hashedPassword], function (err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(409).send("Username or email already exists.");
                }
                return res.status(500).send("Database error: " + err.message);
            }
            res.status(201).json({ message: "User registered successfully!" });
        });
    } catch (error) {
        res.status(500).send("Server error: " + error.message);
    }
});

// Login Route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send("Username and password are required.");
    }

    const query = 'SELECT * FROM users WHERE username = ?';
    db.get(query, [username], async (err, user) => {
        if (err) return res.status(500).send("Database error: " + err.message);
        if (!user) return res.status(401).send("Invalid username or password.");

        // Compare password
        const match = await bcrypt.compare(password, user.password_hash);
        if (match) {
            // Check if admin
            const isAdmin = user.username === 'admin';

            // Return JSON with user details
            res.json({
                message: "Login successful!",
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: isAdmin ? 'admin' : 'user'
                }
            });
        } else {
            res.status(401).send("Invalid username or password.");
        }
    });
});

// --- Admin Authorization Middleware (Protects user privacy) ---
const requireAdminAuth = (req, res, next) => {
    const adminKey = req.headers['x-admin-key'] || req.query.adminKey;
    const expectedKey = process.env.ADMIN_SECRET_KEY;

    // Reject unauthorized access if admin key is not matched
    if (!expectedKey || adminKey !== expectedKey) {
        return res.status(403).json({ error: "Access denied. Admin authorization required." });
    }
    next();
};

// Get all users (Protected)
app.get('/admin/users', requireAdminAuth, (req, res) => {
    db.all('SELECT id, username, email FROM users', [], (err, rows) => {
        if (err) return res.status(500).send(err.message);
        res.json(rows);
    });
});

// Update user (Protected)
app.put('/admin/users/:id', requireAdminAuth, async (req, res) => {
    const { id } = req.params;
    const { username, password } = req.body;

    if (!username) return res.status(400).send("Username is required");

    try {
        let query;
        let params;

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            query = 'UPDATE users SET username = ?, password_hash = ? WHERE id = ?';
            params = [username, hashedPassword, id];
        } else {
            query = 'UPDATE users SET username = ? WHERE id = ?';
            params = [username, id];
        }

        db.run(query, params, function (err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(409).send("Username already exists.");
                }
                return res.status(500).send(err.message);
            }
            if (this.changes === 0) return res.status(404).send("User not found");
            res.send("User updated successfully");
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Get user history (Protected)
app.get('/admin/history/:userId', requireAdminAuth, (req, res) => {
    const { userId } = req.params;
    db.all(`SELECT * FROM history WHERE user_id = ? ORDER BY id DESC`, [userId], (err, rows) => {
        if (err) return res.status(500).send(err.message);
        res.json(rows);
    });
});

// History Routes
app.post('/history', (req, res) => {
    const { userId, date, weight, height, bmi, bmiCategory, goal } = req.body;
    const query = `INSERT INTO history (user_id, date, weight, height, bmi_value, bmi_category, goal) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.run(query, [userId, date, weight, height, bmi, bmiCategory, goal], function (err) {
        if (err) return res.status(500).send(err.message);
        res.json({ id: this.lastID, message: "History saved" });
    });
});

app.get('/history', (req, res) => {
    const { userId } = req.query;
    if (!userId) return res.status(400).send("User ID required");
    db.all(`SELECT * FROM history WHERE user_id = ? ORDER BY id DESC`, [userId], (err, rows) => {
        if (err) return res.status(500).send(err.message);
        res.json(rows);
    });
});

// Reviews Routes
app.post('/reviews', (req, res) => {
    const { userId, username, rating, comment } = req.body;
    if (!username || !comment || !rating) {
        return res.status(400).send("Rating, comment, and username are required.");
    }
    const safeRating = Math.min(5, Math.max(1, parseInt(rating) || 5));
    const safeComment = String(comment).slice(0, 500); // Prevent payload abuse
    const date = new Date().toISOString();
    const query = `INSERT INTO reviews (user_id, username, rating, comment, created_at) VALUES (?, ?, ?, ?, ?)`;
    db.run(query, [userId, username, safeRating, safeComment, date], function (err) {
        if (err) return res.status(500).send(err.message);
        res.json({ id: this.lastID, message: "Review added" });
    });
});

app.get('/reviews', (req, res) => {
    db.all(`SELECT * FROM reviews ORDER BY id DESC`, [], (err, rows) => {
        if (err) return res.status(500).send(err.message);
        res.json(rows);
    });
});

// Cloudinary Upload Route
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).send("No image provided");
    
    // RULE 2: Upload to Cloudinary using upload_stream with file.buffer
    const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'kerala_fitness' },
        (error, result) => {
            if (error) return res.status(500).send("Upload failed: " + error.message);
            res.json({ imageUrl: result.secure_url });
        }
    );
    uploadStream.end(req.file.buffer);
});

// Wrap app to be mounted at /api
const serverApp = express();
serverApp.use('/api', app);

// RULE 4: Export serverless handler
module.exports.handler = serverless(serverApp);
module.exports.app = serverApp;
