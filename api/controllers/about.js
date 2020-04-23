const userCollection = require('../database/models/userModel');

module.exports = {

    /**************Affichage page A propos***************/
    getAbout: async (req, res) => {
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

        res.render('about', {
            dbUserId: dbUserId,
            cookieGA: cookieGA,
            bandeauCookieGA: bandeauCookieGA
        })
    },

}