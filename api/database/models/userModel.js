const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    status: {
        type: String,
        default: 'user'
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    isModo: {
        type: Boolean,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isBan: {
        type: Boolean,
        default: false,
    },
    image: {
        type: String,
        default: "https://i.stack.imgur.com/34AD2.jpg"
    },
    nameImage : String
})

const userCollection = mongoose.model('userCollection', userSchema)

module.exports = userCollection
