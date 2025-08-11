const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const blacklistTokenSchema = new mongoose.Schema({
    token: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now, expires: 172800 } // 48 hours in seconds
});

module.exports = mongoose.model('BlacklistToken', blacklistTokenSchema);