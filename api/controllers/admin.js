const userCollection = require('../database/models/userModel');
const actuCollection = require('../database/models/actuModel');
const messageCollection = require('../database/models/messageModel');
const commentCollection = require('../database/models/commentModel');
const repertoryCollection = require('../database/models/repertoryModel');
const noteCollection = require('../database/models/noteModel');


const path = require('path');
// pour gestion suppression image
const fs = require('fs')
// pour gestion suppression image

module.exports = {

    /**************Affichage page admin***************/
    getAdmin: async (req, res) => {
        const dbUserId = await userCollection.findById(req.session.userId)
        const dbUser = await userCollection.find({})
        const dbActu = await actuCollection.find({})
        const dbMessage = await messageCollection.find({})
        const dbComment = await commentCollection.find({})
        const dbRepertory = await repertoryCollection.find({})
        const dbNote = await noteCollection.find({})

        // console.log(dbUser);

        //console.log("1 " + dbComment[0]);
        //console.log("2 " + dbComment[0].articleId);
        //const dbActuId = await actuCollection.findById(dbComment[0].articleId)
        //console.log("3 " + dbActuId);
        //console.log("4 " + dbActuId.title);
        //dbComment[0].titleArticle = dbActuId.title;
        //console.log("5 " + dbComment[0].titleArticle);

        for (let i in dbComment) {
            const dbActuIdarticleIdComment = await actuCollection.findById(dbComment[i].articleId)
            const dbUserIdauthorIdComment = await userCollection.findById(dbComment[i].authorId)
            dbComment[i].titleArticle = dbActuIdarticleIdComment.title;
            dbComment[i].pseudoAuthor = dbUserIdauthorIdComment.pseudo;

            // console.log(i + "coucou 1 " + dbComment[i].titleArticle)
            // console.log(i + "coucou 2 " + dbComment[i].pseudoAuthor)
        }

        for (let i in dbRepertory) {
            const dbUserIdauthorIdRepertory = await userCollection.findById(dbRepertory[i].authorId)
            dbRepertory[i].pseudoAuthor = dbUserIdauthorIdRepertory.pseudo;

            // console.log(i + "coucou 3 " + dbRepertory[i].pseudoAuthor)
        }

        for (let i in dbNote) {
            const dbUserIdauthorIdNote = await userCollection.findById(dbNote[i].authorId)
            const dbRepertoryIdsiteIdNote = await repertoryCollection.findById(dbNote[i].siteId)
            dbNote[i].pseudoAuthor = dbUserIdauthorIdNote.pseudo;
            dbNote[i].titleSite = dbRepertoryIdsiteIdNote.title;

            // console.log(i + "coucou 4 " + dbNote[i].pseudoAuthor)
            // console.log(i + "coucou 5 " + dbNote[i].titleSite)
        }

        for (let i in dbMessage) {
            const dbUserIdauthorIdMessage = await userCollection.findById(dbMessage[i].authorId)
            dbMessage[i].pseudoAuthor = dbUserIdauthorIdMessage.pseudo;
            dbMessage[i].emailAuthor = dbUserIdauthorIdMessage.email;

            // console.log(i + "coucou 6 " + dbMessage[i].pseudoAuthor)
        }

        res.render('admin/admin', {
            layout: 'adminMain',
            dbUserId: dbUserId,
            dbUser: dbUser,
            dbActu: dbActu,
            dbMessage: dbMessage,
            dbComment: dbComment,
            dbRepertory: dbRepertory,
            dbNote: dbNote
        })
        // appel du layout spécifique "adminMain"
    },

    /**************Affichage page édition utilisateur pour admin***************/
    getUserEdit: async (req, res) => {
        const dbUser = await userCollection.findById(req.params.id)
        // console.log(req.params.id);

        res.render('admin/adminUserEdit', { dbUser })
    },

    /**************Edition utilisateur en isVerified pour admin***************/
    putVerifiedUser: (req, res) => {
        userCollection.findOneAndUpdate(
            { _id: req.params.id },
            {
                isVerified: true,
                fonction: "Vérifié",
            },
            (err) => {
                if (!err) {
                    // console.log('UPDATE OK');
                    res.redirect('/admin')
                } else {
                    res.send(err)
                }
            })

        // console.log(req.params.id);
    },

    /**************Edition utilisateur pour admin***************/
    putlistUser: (req, res) => {
        // console.log(req.body.role);
        // console.log(req.params.id);
        if (req.body.role === 'isAdmin') {
            // "role" est le name du "select" dans la page admin
            userCollection.findOneAndUpdate(
                { _id: req.params.id },
                {
                    fonction: "Administrateur",
                    isVerified: true,
                    isAdmin: true,
                    isBan: false
                },
                { multi: true },
                (err) => {
                    if (!err) {
                        res.redirect('/admin')
                    } else {
                        res.rend(err)
                    }
                }
            )
        } else if (req.body.role === 'isVerified') {
            userCollection.findOneAndUpdate(
                { _id: req.params.id },
                {
                    fonction: "Vérifié",
                    isVerified: true,
                    isAdmin: false,
                    isBan: false
                },
                { multi: true },
                (err) => {
                    if (!err) {
                        res.redirect('/admin')
                    } else {
                        res.rend(err)
                    }
                }
            )
        } else if (req.body.role === 'isBan') {
            userCollection.findOneAndUpdate(
                { _id: req.params.id },
                {
                    fonction: "Bannis",
                    isVerified: false,
                    isAdmin: false,
                    isBan: true
                },
                { multi: true },
                (err) => {
                    if (!err) {
                        res.redirect('/admin')
                    } else {
                        res.rend(err)
                    }
                }
            )
        } else if (req.body.role === 'user') {
            userCollection.findOneAndUpdate(
                { _id: req.params.id },
                {
                    fonction: "Utilisateur",
                    isVerified: false,
                    isAdmin: false,
                    isBan: false
                },
                { multi: true },
                (err) => {
                    if (!err) {
                        res.redirect('/admin')
                    } else {
                        res.rend(err)
                    }
                }
            )
        }
    },

    /**************Suppression utilisateur pour admin***************/
    deleteOneUserAdmin: async (req, res) => {

        // console.log(req.params.id);
        const dbUser = await userCollection.findById(req.params.id);
        const pathImage = path.resolve("public/ressources/images/" + dbUser.nameImage)
        // console.log(dbUser);
        // console.log(dbUser.nameImage);

        if (dbUser.nameImage == null) {
            // mettre undefined plutôt ??
            console.log("pas d'image");
            userCollection.deleteOne(
                { _id: req.params.id },
                (err) => {
                    if (!err) {
                        console.log("User delete");
                        res.redirect('/admin')
                        // res.render('admin')
                    } else {
                        console.log(err);
                    }
                })
        } else {
            userCollection.deleteOne(
                { _id: req.params.id },
                (err) => {
                    if (!err) {
                        fs.unlink(pathImage,
                            (err) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log("User and File delete");
                                    res.redirect('/admin')
                                    // res.render('admin')
                                }
                            }
                        )
                    } else {
                        res.send(err)
                    }
                })
        }
    }
}