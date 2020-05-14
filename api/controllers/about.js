const userCollection = require('../database/models/userModel');

module.exports = {

    /**************Affichage page A propos***************/
    getAbout: async (req, res) => {
        const title = "A propos de moi";
        const description = "Cette page vous permettra d'apprendre à me connaitre ainsi que les raisons qui m'ont poussées à créer ce blog listant les sites de recettes sans allergènes (sans gluten, sans lactose, sans caséine, sans oeufs).";

        const dbUserId = await userCollection.findById(req.session.userId);

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
            bandeauCookieGA: bandeauCookieGA,
            title: title,
            description: description
        })
    },

}