require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const foundRoutes = require('./routes/found');

const app = express();


app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/found', foundRoutes);


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Підключено до MongoDB'))
    .catch(err => {
        console.error('Помилка при підключенні до MongoDB:', err);
        process.exit(1);  
    });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Сервер запущено на порту ${PORT}`));
