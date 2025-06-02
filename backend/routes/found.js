const express = require('express');
const router = express.Router();
const ApartmentItem = require('../models/ApartmentItem');
const auth = require('../middleware/auth');


router.use((req, res, next) => {
    console.log('Incoming request:', req.method, req.originalUrl);
    next();
});


router.post('/', auth, async (req, res) => {
    console.log('POST /api/found - USER ID:', req.userId);

    try {
        const { description, keywords, contact, cost, area, rooms } = req.body;

        const newItem = new ApartmentItem({
            description,
            keywords,
            contact,
            cost,
            area,
            rooms,
            user: req.userId
        });

        await newItem.save();
        res.status(201).json(newItem);
    } catch (err) {
        console.error('Error creating item:', err);
        res.status(400).json({ error: 'Неправильні дані' });
    }
});


router.get('/', async (req, res) => {
    try {
        const searchQuery = req.query.search || '';
        const items = await ApartmentItem.find({
            keywords: { $regex: searchQuery, $options: 'i' }
        }).populate('user', '_id');
        res.json(items);
    } catch (err) {
        console.error('Error fetching items:', err);
        res.status(500).json({ error: 'Помилка сервера' });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const item = await ApartmentItem.findById(req.params.id).populate('user', 'email');
        if (!item) return res.status(404).json({ error: 'Оголошення не знайдено' });
        res.json(item);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Помилка сервера' });
    }
});


router.put('/:id', auth, async (req, res) => {
    try {
        const item = await ApartmentItem.findById(req.params.id);
        if (!item) return res.status(404).json({ error: 'Оголошення не знайдено' });
        console.log('REQ.USERID:', req.userId);
        console.log('ITEM.USER:', item.user.toString());
        if (item.user.toString() !== req.userId) {
            return res.status(403).json({ error: 'Немає прав для редагування' });
        }

        Object.assign(item, (({ description, keywords, contact, cost, area, rooms }) => ({
            description, keywords, contact, cost, area, rooms
        }))(req.body));

        await item.save();
        res.json(item);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Помилка сервера при оновленні' });
    }
});


router.delete('/:id', auth, async (req, res) => {
    try {
        const item = await ApartmentItem.findById(req.params.id);
        if (!item) return res.status(404).json({ error: 'Оголошення не знайдено' });
        if (item.user.toString() !== req.userId) {
            return res.status(403).json({ error: 'Немає прав на видалення' });
        }

        await item.deleteOne();
        res.json({ message: 'Оголошення видалено' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Помилка сервера при видаленні' });
    }
});

module.exports = router;
