module.exports = {

    /**************Affichage page création Contact***************/
    newCookieGA: async (req, res, next) => {
        // console.log('test accept cookie')
        // console.log(req.cookies);

        const d = new Date();
        // console.log(d);
        const year = d.getFullYear();
        const month = d.getMonth();
        const day = d.getDate();
        const date = new Date(year + 1, month, day);
        // console.log(date);

        res.cookie('cookieGA', 'accept', { domain: "www.blogsansallergenes.lt-dev.ovh" , expires: date })

        res.redirect('/')

    },

    refuseCookieGA: async (req, res, next) => {
        // console.log('test refus cookie')
        // console.log(req.cookies);

        res.cookie('cookieGA', 'refuse', { domain: "www.blogsansallergenes.lt-dev.ovh" , expires: 0 })
        // expires : 0 pour que le cookie expire à la fermeture du naviguateur

        res.redirect('/')

    },

    clearCookieGA: (req, res) => {

        req.session.destroy(() => {
            res.clearCookie('cookieGA')

            res.redirect('/')
        })
    },

}