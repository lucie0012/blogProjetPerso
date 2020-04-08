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
            if (dbComment[i].articleId == null) {
                dbComment[i].titleArticle = undefined;
                const dbUserIdauthorIdComment = await userCollection.findById(dbComment[i].authorId)
                dbComment[i].pseudoAuthor = dbUserIdauthorIdComment.pseudo;
            } else if (dbComment[i].authorId == null) {
                dbComment[i].pseudoAuthor = "anonyme";
                const dbActuIdarticleIdComment = await actuCollection.findById(dbComment[i].articleId)
                dbComment[i].titleArticle = dbActuIdarticleIdComment.title;
            } else if (dbComment[i].articleId == null & dbComment[i].authorId == null) {
                dbComment[i].titleArticle = undefined;
                dbComment[i].pseudoAuthor = "anonyme";
            } else {
                const dbActuIdarticleIdComment = await actuCollection.findById(dbComment[i].articleId)
                const dbUserIdauthorIdComment = await userCollection.findById(dbComment[i].authorId)
                dbComment[i].titleArticle = dbActuIdarticleIdComment.title;
                dbComment[i].pseudoAuthor = dbUserIdauthorIdComment.pseudo;

                // console.log(i + "coucou 1 " + dbComment[i].titleArticle)
                // console.log(i + "coucou 2 " + dbComment[i].pseudoAuthor)
            }
        }

        for (let i in dbRepertory) {
            if (dbRepertory[i].authorId == null) {
                dbRepertory[i].pseudoAuthor = "anonyme";
            } else {
                const dbUserIdauthorIdRepertory = await userCollection.findById(dbRepertory[i].authorId)
                dbRepertory[i].pseudoAuthor = dbUserIdauthorIdRepertory.pseudo;
            }


            // console.log(i + "coucou 3 " + dbRepertory[i].pseudoAuthor)
        }

        for (let i in dbNote) {
            if (dbNote[i].authorId == null) {
                dbNote[i].pseudoAuthor = "anonyme";
                const dbRepertoryIdsiteIdNote = await repertoryCollection.findById(dbNote[i].siteId)
                dbNote[i].titleSite = dbRepertoryIdsiteIdNote.title;
            } else if (dbNote[i].siteId == null) {
                dbNote[i].titleSite = undefined;
                const dbUserIdauthorIdNote = await userCollection.findById(dbNote[i].authorId)
                dbNote[i].pseudoAuthor = dbUserIdauthorIdNote.pseudo;
            } else if (dbNote[i].authorId == null & dbNote[i].siteId == null) {
                dbNote[i].pseudoAuthor = "anonyme";
                dbNote[i].titleSite = undefined;
            } else {
                const dbUserIdauthorIdNote = await userCollection.findById(dbNote[i].authorId)
                const dbRepertoryIdsiteIdNote = await repertoryCollection.findById(dbNote[i].siteId)
                dbNote[i].pseudoAuthor = dbUserIdauthorIdNote.pseudo;
                dbNote[i].titleSite = dbRepertoryIdsiteIdNote.title;
            }

            // console.log(i + "coucou 4 " + dbNote[i].pseudoAuthor)
            // console.log(i + "coucou 5 " + dbNote[i].titleSite)
        }

        // for (let i in dbMessage) {
        //     if (dbMessage[i].authorId == null) {
        //         dbMessage[i].pseudoAuthor = "anonyme";
        //         dbMessage[i].emailAuthor = "anonyme";
        //     } else {
        //         const dbUserIdauthorIdMessage = await userCollection.findById(dbMessage[i].authorId)
        //         dbMessage[i].pseudoAuthor = dbUserIdauthorIdMessage.pseudo;
        //         dbMessage[i].emailAuthor = dbUserIdauthorIdMessage.email;
        //     }
        //     // console.log(i + "coucou 6 " + dbMessage[i].pseudoAuthor)
        // }

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
        // console.log(req.body);

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
                    fonction: "Banni",
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

    /**************Suppression compte par admin : modification des statuts user : notamment en isDelete : true***************/
    putUserEditDelete: async (req, res) => {

        // console.log(req.params.id);

        const isDelete = true;
        const typeDefault = false;
        const deleteDate = new Date()

        userCollection.findOneAndUpdate(
            { _id: req.params.id },
            {
                fonction: "Utilisateur supprimé",
                isDelete: isDelete,
                isAdmin: typeDefault,
                isVerified: typeDefault,
                isBan: typeDefault,
                deleteDate: deleteDate
            },
            { multi: true },
            (err) => {
                if (!err) {
                    console.log("User status delete");
                    res.redirect('/admin')

                    commentCollection.updateMany(
                        { authorId: req.params.id },
                        {
                            authorId: null
                        },
                        { multi: true },
                        (err) => {
                            if (!err) {
                                console.log("update authorId comment ok");
                            } else {
                                res.rend(err)
                            }
                        }
                    )
                    messageCollection.updateMany(
                        { authorId: req.params.id },
                        {
                            authorId: null
                        },
                        { multi: true },
                        (err) => {
                            if (!err) {
                                console.log("update authorId message ok");
                            } else {
                                res.rend(err)
                            }
                        }
                    )
                    noteCollection.updateMany(
                        { authorId: req.params.id },
                        {
                            authorId: null
                        },
                        { multi: true },
                        (err) => {
                            if (!err) {
                                console.log("update authorId note ok");
                            } else {
                                res.rend(err)
                            }
                        }
                    )
                    repertoryCollection.updateMany(
                        { authorId: req.params.id },
                        {
                            authorId: null
                        },
                        { multi: true },
                        (err) => {
                            if (!err) {
                                console.log("update authorId repertory ok");
                            } else {
                                res.rend(err)
                            }
                        }
                    )
                } else {
                    console.log(err);
                }
            })
    },

    // /**************Suppression utilisateur pour admin***************/
    // deleteOneUserAdmin: async (req, res) => {

    //     // console.log(req.params.id);
    //     const dbUser = await userCollection.findById(req.params.id);
    //     const pathImage = path.resolve("public/ressources/images/" + dbUser.nameImage)
    //     // console.log(dbUser);
    //     // console.log(dbUser.nameImage);

    //     if (dbUser.nameImage == null) {
    //         // mettre undefined plutôt ??
    //         console.log("pas d'image");
    //         userCollection.deleteOne(
    //             { _id: req.params.id },
    //             (err) => {
    //                 if (!err) {
    //                     console.log("User delete");
    //                     res.redirect('/admin')
    //                     // res.render('admin')
    //                 } else {
    //                     console.log(err);
    //                 }
    //             })
    //     } else {
    //         userCollection.deleteOne(
    //             { _id: req.params.id },
    //             (err) => {
    //                 if (!err) {
    //                     fs.unlink(pathImage,
    //                         (err) => {
    //                             if (err) {
    //                                 console.log(err);
    //                             } else {
    //                                 console.log("User and File delete");
    //                                 res.redirect('/admin')
    //                                 // res.render('admin')
    //                             }
    //                         }
    //                     )
    //                 } else {
    //                     res.send(err)
    //                 }
    //             })
    //     }
    // }
}