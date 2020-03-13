const userCollection = require('../database/models/userModel');
const actuCollection = require('../database/models/actuModel');
const messageCollection = require('../database/models/messageModel');
const commentCollection = require('../database/models/commentModel');
const repertoryCollection = require('../database/models/repertoryModel');
const noteCollection = require('../database/models/noteModel');


const path = require('path');
// pour gestion suppression image
const fs = require('fs')
// pour gestion suppression image

module.exports = {

    /**************Affichage page admin***************/
    getAdmin: async (req, res) => {
        const dbUserId = await userCollection.findById(req.session.userId)
        const dbUser = await userCollection.find({})
        const dbActu = await actuCollection.find({})
        const dbMessage = await messageCollection.find({})
        const dbComment = await commentCollection.find({})
        const dbRepertory = await repertoryCollection.find({})
        const dbNote = await noteCollection.find({})

        // console.log(dbUser);

        res.render('admin/admin', {
            layout: 'adminMain',
            dbUserId: dbUserId,
            dbUser: dbUser,
            dbActu: dbActu,
            dbMessage: dbMessage,
            dbComment: dbComment,
            dbRepertory: dbRepertory,
            dbNote: dbNote
        })
        // appel du layout spécifique "adminMain"
    },

}