const mongoose = require('mongoose');

const repertorySchema = new mongoose.Schema({

    authorId : String,
    title : String,
    image: {
        type: String,
        default: "/public/ressources/images/default/siteDefaultImage.jpeg"
    },
    nameImage : String,
    content : String,
    url : String,
    category : Array,
    note : String,
    createDate : {
        type: Date,
        default : new Date(),
    },
    isVerified : {
        type : Boolean,
        default : false,
    },

})

const repertoryCollection = mongoose.model('repertoryCollection', repertorySchema)
// ('repertoryCollection'  correspond au nom que notre collection prendra dans la BDD

module.exports = repertoryCollection
