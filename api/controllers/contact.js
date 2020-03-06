const messageCollection = require('../database/models/messageModel');


module.exports = {

    /**************Affichage page création Contact***************/
    getContact: (req, res) => {
        res.render('contact')
    },

}