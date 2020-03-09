const userCollection = require('../database/models/userModel');

module.exports = {

    /**************Affichage page Home***************/
    getHome: async (req, res) => {
        const dbUser = await userCollection.findById(req.session.userId)

        res.render('home', { dbUser: dbUser })
    }
}