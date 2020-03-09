const userCollection = require('../database/models/userModel');
const actuCollection = require('../database/models/actuModel');

module.exports = {

    /**************Affichage page Home***************/
    getHome: async (req, res) => {
        const dbUser = await userCollection.findById(req.session.userId)
        const dbActu = await actuCollection.find({})

        res.render('home', { dbActu: dbActu, dbUser: dbUser })
    }
}