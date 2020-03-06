const repertoryCollection = require('../database/models/repertoryModel');
const path = require('path');
// pour gestion suppression image
const fs = require('fs')
// pour gestion suppression image


module.exports = {

    /**************Affichage page Repertoire***************/
    getRepertory: (req, res) => {
        res.render('repertory/repertory')
    },

}