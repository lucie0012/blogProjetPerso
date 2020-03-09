const messageCollection = require('../database/models/messageModel');
const userCollection = require('../database/models/userModel');


module.exports = {

    /**************Affichage page création Contact***************/
    getContact: async (req, res) => {
        const dbUser = await userCollection.findById(req.session.userId)

        res.render('contact', { dbUser: dbUser })
    },

    /**************Envoi d'un message***************/
    postMessage: (req, res) => {
        messageCollection.create(
            {
                nameAuthor : req.body.name,
                pseudoAuthor: req.body.pseudo,
                emailAuthor: req.body.email,
                subject: req.body.subject,
                content: req.body.content,
            },
            (err) => {
                if (!err) {
                    // res.redirect('/actuSingle/' + req.params.id)
                    res.redirect('back')
                    // 'back' permet de revenir à la page précédente
                } else {
                    res.send(err)
                }
            })
        // console.log(req.body)
        // console.log(req.params.id)
    },

}