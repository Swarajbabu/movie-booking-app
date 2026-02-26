const mongoose = require('mongoose');

const theatreSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    city: { type: String },
    totalScreens: { type: Number, default: 1 },
    // Basic geometry/layout info can be here if homogeneous screens
}, { timestamps: true });

module.exports = mongoose.model('Theatre', theatreSchema);
