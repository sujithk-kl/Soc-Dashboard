// server/models/eventModel.js
const mongoose = require('mongoose');
const { encryptString, decryptToString } = require('../utils/crypto');

const eventSchema = mongoose.Schema({
    title: { type: String, required: true },
    descriptionEnc: {
        iv: String,
        tag: String,
        data: String,
        kid: String,
    },
    sourceIp: { type: String },
    status: { type: String, required: true }, // Corresponds to severity
    time: { type: String, required: true },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

eventSchema.virtual('description')
    .get(function () { return decryptToString(this.descriptionEnc); })
    .set(function (val) { this.descriptionEnc = encryptString(val); });

eventSchema.methods.toJSON = function () {
    const obj = this.toObject({ virtuals: true });
    delete obj.descriptionEnc;
    return obj;
};

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;