// server/models/alertModel.js
const mongoose = require('mongoose');

const alertSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    source: { type: String, required: true },
    severity: { type: String, required: true },
    status: { type: String, required: true, default: 'open' },
}, { timestamps: true });

const Alert = mongoose.model('Alert', alertSchema);
module.exports = Alert;