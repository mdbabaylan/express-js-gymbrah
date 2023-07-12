const mongoose = require('mongoose');

// will create a collection in MongoDB Atlas

const dataSchema = new mongoose.Schema({
    user_id: {
        required: true,
        type: Number
    },
    password: {
        required: true,
        type: String
    }
})

module.exports = mongoose.model('Users', dataSchema)