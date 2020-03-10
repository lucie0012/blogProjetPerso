const messageCollection = require('../database/models/messageModel');
const userCollection = require('../database/models/userModel');


module.exports = {

    /**************Affichage page création Contact***************/
    getContact: async (req, res) => {
        const dbUserId = await userCollection.findById(req.session.userId)

        res.render('contact', { dbUserId: dbUserId })
    },

    /**************Envoi d'un message***************/
    postMessage: (req, res) => {
        messageCollection.create(
            {
                nameAuthor: req.body.name,
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

    /**************Suppression de message***************/
    deleteOneMessage: (req, res) => {
        // console.log(req.params.id);

        messageCollection.deleteOne(
            { _id: req.params.id },
            (err) => {
                if (err) {
                    res.send(err)
                    // console.log('suppression pas OK');
                } else {
                    res.redirect('/admin')
                    // console.log('suppression OK');
                }
            })
    }

}