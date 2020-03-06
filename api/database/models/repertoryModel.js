const mongoose = require('mongoose');

const repertorySchema = new mongoose.Schema({

    title : String,
    image : String,
    nameImage : String,
    url : String,
    note : String,
    createDate : {
        type: Date,
        default : new Date(),
    },
    isVerified : {
        type : Boolean,
        default : true,
    },

})

const repertoryCollection = mongoose.model('repertoryCollection', repertorySchema)
// ('repertoryCollection'  correspond au nom que notre collection prendra dans la BDD

module.exports = repertoryCollection
