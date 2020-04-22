const userCollection = require('../database/models/userModel');

module.exports = {

    /**************Affichage page A propos***************/
    getAbout: async (req, res) => {
        const dbUserId = await userCollection.findById(req.session.userId)

        const cookieGA = req.cookies.cookieGA

        res.render('about', {
            dbUserId: dbUserId,
            cookieGA: cookieGA
        })
    },

}