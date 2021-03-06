const messageCollection = require('../database/models/messageModel');
const userCollection = require('../database/models/userModel');
const meta = require('./meta');


module.exports = {

    /**************Affichage page création Contact***************/
    getContact: async (req, res) => {
        const title = meta.contact.title;
        const description = meta.contact.description;

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

        res.render('contact', {
            dbUserId: dbUserId,
            needAlert: false,
            cookieGA: cookieGA,
            bandeauCookieGA: bandeauCookieGA,
            title: title,
            description: description
        })
    },

    /**************Envoi d'un message***************/
    postMessage: async (req, res) => {
        const title = meta.contact.title;
        const description = meta.contact.description;

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

        // console.log(req.body);

        let gridCheck;
        // console.log(gridCheck);
        if (req.body.gridCheckContact == 'on') {
            gridCheck = true
        } else {
            gridCheck = false
        }
        // console.log(gridCheck);

        if (!gridCheck) {
            let notGridCheck = true;
            let isError = true;

            res.render('contact', {
                needAlert: true,
                isError: isError,
                notGridCheck: notGridCheck,
                dbUserId: dbUserId,
                cookieGA: cookieGA,
                bandeauCookieGA: bandeauCookieGA,
                title: title,
                description: description
            })
        } else {
            messageCollection.create(
                {
                    authorId: req.session.userId,
                    nameAuthor: req.body.name,
                    pseudoAuthor: req.body.pseudo,
                    emailAuthor: req.body.email,
                    subject: req.body.subject,
                    content: req.body.content,
                },
                (err) => {
                    // err != null -> est l'équivalent d'une condition if qui retourne un boolean
                    let isError = err != null;

                    if (isError) {
                        console.log(err);
                    }

                    res.render('contact', {
                        needAlert: true,
                        isError: isError,
                        dbUserId: dbUserId,
                        cookieGA: cookieGA,
                        bandeauCookieGA: bandeauCookieGA,
                        title: title,
                        description: description
                    })
                })
            // console.log(req.body)
            // console.log(req.params.id)
        }
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
                    res.redirect('/privateAdmin')
                    // console.log('suppression OK');
                }
            })
    }

}