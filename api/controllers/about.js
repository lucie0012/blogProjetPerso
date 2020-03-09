module.exports = {

    /**************Affichage page A propos***************/
    getAbout: async (req, res) => {
        const dbUser = await userCollection.findById(req.session.userId)

        res.render('about', { dbUser: dbUser })
    },

}