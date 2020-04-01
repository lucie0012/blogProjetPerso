const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({

    authorId : String,
    articleId : String,
    content : String,
    createDate : {
        type: Date,
        default : new Date(),
    },
    isVerified : {
        type : Boolean,
        default : false,
    },

})

const commentCollection = mongoose.model('commentCollection', commentSchema)
// ('messageCollection'  correspond au nom que notre collection prendra dans la BDD

module.exports = commentCollection
