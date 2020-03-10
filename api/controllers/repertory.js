const repertoryCollection = require('../database/models/repertoryModel');
const userCollection = require('../database/models/userModel');
const path = require('path');
// pour gestion suppression image
const fs = require('fs')
// pour gestion suppression image


module.exports = {

    /**************Affichage page Repertoire***************/
    getRepertory: async (req, res) => {
        const dbUserId = await userCollection.findById(req.session.userId)

        res.render('repertory/repertory', { dbUserId: dbUserId })
    },

}