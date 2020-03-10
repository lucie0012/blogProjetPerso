const userCollection = require('../database/models/userModel');
const actuCollection = require('../database/models/actuModel');
const messageCollection = require('../database/models/messageModel');

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
        res.render('admin/admin', { dbUserId: dbUserId, dbUser: dbUser, dbActu: dbActu, dbMessage: dbMessage })
    },

    /**************Affichage liste utilisateur pour admin***************/
    getUserList: async (req, res) => {
        const dbUser = await userCollection.find({})
        // console.log(dbUser);

        res.render('admin/adminUserList', {
            layout: 'adminMain',
            dbUser: dbUser
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
        }
    },

    /**************Suppression utilisateur pour admin***************/
    deleteOneUser: async (req, res) => {
        // console.log(req.params.id);
        const dbUser = await userCollection.findById(req.params.id);
        const pathImage = path.resolve("public/ressources/images/" + dbUser.nameImage)
        userCollection.deleteOne(
            { _id: req.params.id },
            (err) => {
                if (!err) {
                    fs.unlink(pathImage,
                        (err) => {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log("File delete");
                                res.redirect('/admin')
                            }
                        }
                    )
                } else {
                    res.send(err)
                }
            })
    },
}