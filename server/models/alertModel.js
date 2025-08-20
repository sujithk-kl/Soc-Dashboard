// server/models/alertModel.js
const mongoose = require('mongoose');
const { encryptString, decryptToString } = require('../utils/crypto');

const alertSchema = mongoose.Schema({
    title: { type: String, required: true },
    // Store encrypted blob
    descriptionEnc: {
        iv: String,
        tag: String,
        data: String,
        kid: String,
    },
    source: { type: String, required: true },
    severity: { type: String, required: true },
    status: { type: String, required: true, default: 'open' },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

// Virtual plain description
alertSchema.virtual('description')
    .get(function () {
        return decryptToString(this.descriptionEnc);
    })
    .set(function (val) {
        this.descriptionEnc = encryptString(val);
    });

// Ensure transforms include virtual and remove enc fields from JSON
alertSchema.methods.toJSON = function () {
    const obj = this.toObject({ virtuals: true });
    delete obj.descriptionEnc;
    return obj;
};

// Prevent many duplicates for the same alert title created at same minute
alertSchema.index({ title: 1, createdAt: 1 }, { sparse: true });

const Alert = mongoose.model('Alert', alertSchema);
module.exports = Alert;