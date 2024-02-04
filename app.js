const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const Blog = require('./models/blog');

// Подключение к базе данных
mongoose.connect("mongodb://localhost:27017/blogDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

// Middleware
app.use(cors());
app.use(express.json());



// **POST /blogs**
app.post('/blogs', async (req, res) => {
    const { title, body, author } = req.body;

    // Валидация данных
    if (!title || !body) {
        return res.status(400).send({ error: 'Title and body are required.' });
    }

    // Создание нового блога
    const blog = new Blog({
        title,
        body,
        author
    });

    try {
        await blog.save();
        res.status(201).send(blog);
    } catch (err) {
        res.status(400).send(err);
    }
});

// **GET /blogs**
app.get('/blogs', async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.status(200).send(blogs);
    } catch (err) {
        res.status(500).send(err);
    }
});

// **GET /blogs/:id**
app.get('/blogs/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const blog = await Blog.findById(id);
        if (!blog) return res.status(404).send('Blog not found.');
        res.status(200).send(blog);
    } catch (err) {
        res.status(500).send(err);
    }
});

// **PUT /blogs/:id**
app.put('/blogs/:id', async (req, res) => {
    const id = req.params.id;
    const { title, body, author } = req.body;

    // Валидация данных
    if (!title || !body) {
        return res.status(400).send({ error: 'Title and body are required.' });
    }

    try {
        const blog = await Blog.findByIdAndUpdate(id, { title, body, author });
        if (!blog) return res.status(404).send('Blog not found.');
        res.status(200).send(blog);
    } catch (err) {
        res.status(500).send(err);
    }
});

// **DELETE /blogs/:id**
app.delete('/blogs/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const blog = await Blog.findByIdAndDelete(id);
        if (!blog) return res.status(404).send('Blog not found.');
        res.status(200).send({ message: 'Blog deleted successfully.' });
    } catch (err) {
        res.status(500).send(err);
    }
});

// Запуск сервера
app.listen(3000, () => console.log('Server running on port 3000'));
