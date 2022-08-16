const { mongoose } = require('mongoose');

const userSchema = new mongoose.Schema({
    id: Number,
    tokens: Number,
    timely: {
        type: Number,
        default: 0
    },
    weekly: {
        type: Number,
        default: 0
    },
    married: {
        type: Number,
        default: 0
    }
});

module.exports = { userSchema };