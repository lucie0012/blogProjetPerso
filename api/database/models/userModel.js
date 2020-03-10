const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        require: true,
    },
    pseudo : {
        type: String,
        require: true,
    },
    email: {
        type: String,
        unique: true,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    status: {
        type: String,
        default: 'user'
    },
    fonction: {
        type: String,
        default: 'Utilisateur'
    },
    image: {
        type: String,
        default: "/public/ressources/images/profilDefaultImage.jpg"
    },
    nameImage : String,
    createDate : {
        type: Date,
        default : new Date(),
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isBan: {
        type: Boolean,
        default: false,
    },
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
