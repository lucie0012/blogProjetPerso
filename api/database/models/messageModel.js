const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({

    nameAuthor : String,
    pseudoAuthor : String,
    emailAuthor : String,
    subject : String,
    content : String,
    createDate : {
        type: Date,
        default : new Date(),
    },
    isVerified : {
        type : Boolean,
        default : true,
    },

})

const messageCollection = mongoose.model('messageCollection', messageSchema)
// ('messageCollection'  correspond au nom que notre collection prendra dans la BDD

module.exports = messageCollection
