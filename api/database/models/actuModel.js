const mongoose = require('mongoose');

const actuSchema = new mongoose.Schema({

    title : String,
    image : String,
    nameImage : String,
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

const actuCollection = mongoose.model('actuCollection', actuSchema)
// ('actuCollection'  correspond au nom que notre collection prendra dans la BDD

module.exports = actuCollection
