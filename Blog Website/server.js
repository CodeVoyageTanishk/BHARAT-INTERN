const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path'); // Import path module

const app = express();
const PORT = process.env.PORT || 3001; // Change port to 3001

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/advanced-blog', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

// Define schema for articles
const articleSchema = new mongoose.Schema({
    title: String,
    content: String,
});

const Article = mongoose.model('Article', articleSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/api/articles', async (req, res) => {
    try {
        const articles = await Article.find();
        res.json(articles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/articles', async (req, res) => {
    const article = new Article({
        title: req.body.title,
        content: req.body.content,
    });
    try {
        const newArticle = await article.save();
        res.status(201).json(newArticle);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.delete('/api/articles/:id', async (req, res) => {
    try {
        await Article.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted article' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Serve index.html for any other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
