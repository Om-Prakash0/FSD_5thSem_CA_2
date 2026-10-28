const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    available: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const Book = mongoose.model('Book', bookSchema);
router.post('/', async (req, res) => {
    try {
        const { title, author, category } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                message: 'Title is required'
            });
        }

        const book = await Book.create({
            title,
            author,
            category
        });

        res.status(201).json(book);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.get('/', async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, parseInt(req.query.limit) || 10);
        const total = await Book.countDocuments();
        const books = await Book.find()
            .skip((page - 1) * limit)
            .limit(limit);
        res.status(200).json({
            page,
            limit,
            total,
            books
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { available } = req.body;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: 'Invalid book ID'
            });
        }
        if (typeof available !== 'boolean') {
            return res.status(400).json({
                message: 'Available must be true or false'
            });
        }
        const book = await Book.findByIdAndUpdate(
            id,
            { available },
            { new: true, runValidators: true }
        );

        if (!book) {
            return res.status(404).json({
                message: 'Book not found'
            });
        }

        res.status(200).json(book);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
