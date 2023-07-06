const mongoose = require('mongoose');

// date || user_id || weight log (in lbs)

const dataSchema = new mongoose.Schema({
    date: {
        required: true,
        type: Date
    },
    user_id: {
        required: true,
        type: Number
    },
    weight: {
        required: true,
        type: Number
    }
})

module.exports = mongoose.model('Data', dataSchema)