const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },
    pseudo : {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
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
        default: "/public/ressources/images/default/profilDefaultImage.jpg"
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
    isDelete: {
        type: Boolean,
        default: false,
    },
    deleteDate: Date
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
