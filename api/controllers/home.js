const userCollection = require('../database/models/userModel');
const actuCollection = require('../database/models/actuModel');
const repertoryCollection = require('../database/models/repertoryModel');
const meta = require('./meta');

module.exports = {

    /**************Affichage page Home***************/
    getHome: async (req, res) => {
        const title = meta.home.title;
        const description = meta.home.description;

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
            bandeauCookieGA: bandeauCookieGA,
            title: title,
            description: description
        })
    },


    /**************Affichage page conditions générales utilisation***************/
    getTermsOfService: async (req, res) => {
        const title = meta.termsOfService.title;
        const description = meta.termsOfService.description;

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
            bandeauCookieGA: bandeauCookieGA,
            title: title,
            description: description
        })
    },


    /**************Affichage page mentions légales***************/
    getLegalNotice: async (req, res) => {
        const title = meta.legalNotice.title;
        const description = meta.legalNotice.description;

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
            bandeauCookieGA: bandeauCookieGA,
            title: title,
            description: description
        })
    },

    /**************Affichage page mentions légales***************/
    getManagingCookiesPreferences: async (req, res) => {
        const title = meta.managingCookiesPreferences.title;
        const description = meta.managingCookiesPreferences.description;

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
            bandeauCookieGA: bandeauCookieGA,
            title: title,
            description: description
        })
    },

}