const messageCollection = require('../database/models/messageModel');
const userCollection = require('../database/models/userModel');


module.exports = {

    /**************Affichage page création Contact***************/
    getContact: async (req, res) => {
        const dbUserId = await userCollection.findById(req.session.userId)

        res.render('contact', { dbUserId: dbUserId,
         needAlert: false})
    },

    /**************Envoi d'un message***************/
    postMessage: (req, res) => {
 
        messageCollection.create(
            {
                authorId: req.session.userId,
                subject: req.body.subject,
                content: req.body.content,
            },
            (err) => {
                // err != null -> est l'équivalent d'une condition if qui retourne un boolean
                let isError = err != null;

                if(isError)
                {
                    console.log(err);
                }    

                res.render('contact', { needAlert : true,
                    isError : isError})
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