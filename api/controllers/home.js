const userCollection = require('../database/models/userModel');
const actuCollection = require('../database/models/actuModel');
const repertoryCollection = require('../database/models/repertoryModel');

module.exports = {

    /**************Affichage page Home***************/
    getHome: async (req, res) => {
        // console.log(repertoryCollection.find({ isVerified : true }));

        const dbUserId = await userCollection.findById(req.session.userId)
        const dbActu = await actuCollection.find({})
        const dbRepertoryVerified = await repertoryCollection.find({ isVerified: true })

        res.render('home', {
            dbActu: dbActu,
            dbUserId: dbUserId,
            dbRepertoryVerified: dbRepertoryVerified
        })
    },


    /**************Affichage page conditions générales utilisation***************/
    getTermsOfService: (req, res) => {
        res.render('termsOfService')
    },


    /**************Affichage page mentions légales***************/
    getLegalNotice: (req, res) => {
        res.render('legalNotice')
    },

}