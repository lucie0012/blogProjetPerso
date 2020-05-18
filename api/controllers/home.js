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

        // console.log(req.cookies);
        let cookieGA = false
        let bandeauCookieGA = true

        if (req.cookies.cookieGA === 'accept') {
            cookieGA = true
            bandeauCookieGA = false
        } else if (req.cookies.cookieGA === 'refuse') {
            bandeauCookieGA = false
        }
        // console.log(cookieGA);
        // console.log(bandeauCookieGA);

        res.render('home', {
            dbActu: dbActu,
            dbUserId: dbUserId,
            dbRepertoryVerified: dbRepertoryVerified,
            cookieGA: cookieGA,
            bandeauCookieGA: bandeauCookieGA
        })
    },


    /**************Affichage page conditions générales utilisation***************/
    getTermsOfService: async (req, res) => {
        const dbUserId = await userCollection.findById(req.session.userId)

        // console.log(req.cookies);
        let cookieGA = false
        let bandeauCookieGA = true

        if (req.cookies.cookieGA === 'accept') {
            cookieGA = true
            bandeauCookieGA = false
        } else if (req.cookies.cookieGA === 'refuse') {
            bandeauCookieGA = false
        }
        // console.log(cookieGA);
        // console.log(bandeauCookieGA);

        res.render('termsOfService', {
            dbUserId: dbUserId,
            cookieGA: cookieGA,
            bandeauCookieGA: bandeauCookieGA
        })
    },


    /**************Affichage page mentions légales***************/
    getLegalNotice: async (req, res) => {
        const dbUserId = await userCollection.findById(req.session.userId)

        // console.log(req.cookies);
        let cookieGA = false
        let bandeauCookieGA = true

        if (req.cookies.cookieGA === 'accept') {
            cookieGA = true
            bandeauCookieGA = false
        } else if (req.cookies.cookieGA === 'refuse') {
            bandeauCookieGA = false
        }
        // console.log(cookieGA);
        // console.log(bandeauCookieGA);

        res.render('legalNotice', {
            dbUserId: dbUserId,
            cookieGA: cookieGA,
            bandeauCookieGA: bandeauCookieGA
        })
    },

    /**************Affichage page mentions légales***************/
    getManagingCookiesPreferences: async (req, res) => {
        const dbUserId = await userCollection.findById(req.session.userId)

        // console.log(req.cookies);
        let cookieGA = false
        let bandeauCookieGA = true

        if (req.cookies.cookieGA === 'accept') {
            cookieGA = true
            bandeauCookieGA = false
        } else if (req.cookies.cookieGA === 'refuse') {
            bandeauCookieGA = false
        }
        // console.log(cookieGA);
        // console.log(bandeauCookieGA);

        res.render('managingCookiesPreferences', {
            dbUserId: dbUserId,
            cookieGA: cookieGA,
            bandeauCookieGA: bandeauCookieGA
        })
    },

}