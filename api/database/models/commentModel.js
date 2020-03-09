const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({

    pseudoAuthor : String,
    authorId : String,
    articleId : String,
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

const commentCollection = mongoose.model('commentCollection', commentSchema)
// ('messageCollection'  correspond au nom que notre collection prendra dans la BDD

module.exports = commentCollection
