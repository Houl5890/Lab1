const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';


router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Ім’я вже зайняте' });
        }

        const user = new User({ username, password });
        await user.save();

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET || 'secretkey');


        res.status(201).json({
            token,
            user: {
                _id: user._id,
                username: user.username
            }
        });
    } catch (err) {
        res.status(500).json({ error: 'Помилка сервера' });
    }
});


router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Неправильні дані' });
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET || 'secretkey');


        res.json({
            token,
            user: {
                _id: user._id,
                username: user.username
            }
        });
    } catch (err) {
        res.status(500).json({ error: 'Помилка сервера' });
    }
});

module.exports = router;
