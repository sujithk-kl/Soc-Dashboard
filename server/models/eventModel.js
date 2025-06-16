// server/models/eventModel.js
const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    sourceIp: { type: String },
    status: { type: String, required: true }, // Corresponds to severity
    time: { type: String, required: true },
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;