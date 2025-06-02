const mongoose = require('mongoose');

const ApartmentItemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  keywords: { type: String, required: true },
  contact: { type: String, required: true },
    cost: { type: Number, required: true },
    area: { type: Number, required: true },
    rooms: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  
}, { timestamps: true });

module.exports = mongoose.model('ApartmentItem', ApartmentItemSchema);
