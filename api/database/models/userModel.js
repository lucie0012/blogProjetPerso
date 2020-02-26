const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

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
        default: 'Utilisateur'
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

userSchema.pre('save', function (next) {
    const user = this
    bcrypt.hash(user.password, 12, (err, encrypted) => {
        user.password = encrypted
        next()
    })
})

const userCollection = mongoose.model('userCollection', userSchema)

module.exports = userCollection
