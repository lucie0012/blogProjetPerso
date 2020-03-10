const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({

    pseudoAuthor: String,
    authorId: String,
    siteId : String,
    note : String,
    comment : String,
    createDate : {
        type: Date,
        default : new Date(),
    },
    isVerified : {
        type : Boolean,
        default : true,
    },

})

const noteCollection = mongoose.model('noteCollection', noteSchema)
// ('actuCollection'  correspond au nom que notre collection prendra dans la BDD

module.exports = noteCollection
