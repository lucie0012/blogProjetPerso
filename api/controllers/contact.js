const messageCollection = require('../database/models/messageModel');
const userCollection = require('../database/models/userModel');


module.exports = {

    /**************Affichage page création Contact***************/
    getContact: async (req, res) => {
        const dbUser = await userCollection.findById(req.session.userId)

        res.render('contact', { dbUser: dbUser })
    },

}