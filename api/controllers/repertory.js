const repertoryCollection = require('../database/models/repertoryModel');
const userCollection = require('../database/models/userModel');
const noteCollection = require('../database/models/noteModel');

const path = require('path');
// pour gestion suppression image
const fs = require('fs')
// pour gestion suppression image


module.exports = {

    /**************Affichage page Repertoire***************/
    getRepertory: async (req, res) => {
        const dbUserId = await userCollection.findById(req.session.userId)
        const dbRepertory = await repertoryCollection.find({})
        // console.log(dbUserId);
        // console.log(dbUserId.isVerified);

        let userVerified = dbUserId != null ? dbUserId.isVerified : false;
        // condition ternaire
        // console.log(userVerified);



        res.render('repertory/repertory', {
            dbUserId: dbUserId,
            dbRepertory: dbRepertory,
            userVerified : userVerified
        })
    },

    /**************Création d'un site pour le répertoire ***************/
    postSiteCreate: (req, res) => {
        repertoryCollection.create(
            {
                title: req.body.title,
                url: req.body.url,
                content: req.body.content,
                category: req.body.category,
                pseudo: req.session.pseudo
            },
            (err) => {
                if (!err) {
                    res.redirect('/repertory')
                    // 'back' permet de revenir à la page précédente
                } else {
                    res.send(err)
                }
            })
        // console.log(req.body)
        // console.log(req.params.id)
    },

    /************** Validation d'un site pour le répertoire ***************/
    putSiteValid: (req, res) => {
        // console.log(req.params.id);

        repertoryCollection.findOneAndUpdate(
            { _id: req.params.id },
            {
                isVerified: true,
            },
            (err) => {
                if (!err) {
                    // console.log("update ok");
                    res.redirect('back')
                    // 'back' permet de revenir à la page précédente
                } else {
                    res.send(err)
                }
            })
    },

    /************** Edition d'un site pour le répertoire ***************/
    putSite: (req, res) => {
        console.log(req.params.id);
        console.log(req.body);

        repertoryCollection.findOneAndUpdate(
            { _id: req.params.id },
            {
                title: req.body.title,
                url: req.body.url,
                content: req.body.content,
                category: "Indéfini",
            },
            (err) => {
                if (!err) {
                    // console.log("update ok");
                    res.redirect('back')
                    // 'back' permet de revenir à la page précédente
                } else {
                    res.send(err)
                }
            })
    },

    /**************Suppression d'un site pour le répertoire ***************/
    deleteOneSite: (req, res) => {
        // console.log(req.params.id);

        repertoryCollection.deleteOne(
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
    },

    /**************Création d'une note ***************/
    postNote: (req, res) => {
        noteCollection.create(
            {
                note: req.body.note,
                comment: req.body.comment,
                pseudoAuthor: req.session.pseudo,
                authorId: req.session.userId,
                siteId: req.params.id,
            },
            (err) => {
                if (!err) {
                    res.redirect('back')
                    // 'back' permet de revenir à la page précédente
                } else {
                    res.send(err)
                }
            })
        console.log(req.body)
        console.log(req.params.id)
        console.log(req.session);

    },

    /************** Validation d'un site pour le répertoire ***************/
    putNoteValid: (req, res) => {
        // console.log(req.params.id);

        noteCollection.findOneAndUpdate(
            { _id: req.params.id },
            {
                isVerified: true,
            },
            (err) => {
                if (!err) {
                    // console.log("update ok");
                    res.redirect('back')
                    // 'back' permet de revenir à la page précédente
                } else {
                    res.send(err)
                }
            })
    },


    /**************Suppression d'une note/commentaire ***************/
    deleteOneNote: (req, res) => {
        // console.log(req.params.id);

        noteCollection.deleteOne(
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
    },

}