const userCollection = require('../database/models/userModel');
const path = require('path');
// pour gestion suppression image
const fs = require('fs')
// pour gestion suppression image
const bcrypt = require('bcrypt')
// pour compare password chiffré

module.exports = {

    /**************Affichage page création compte***************/
    getUserCreate: (req, res) => {
        res.render('user/userCreate')
    },

    /**************Création compte*************/
    postUserCreate: (req, res) => {
        // console.log(req.body);
        const Pass = req.body.password
        const confPass = req.body.confPassword
        // console.log(Pass + ' ' + confPass);

        if (Pass !== confPass) {
            //comparaison des mots de passe
            res.redirect('/userCreate')
        } else {
            if (!req.file) {
                userCollection.create(
                    {
                        email: req.body.email,
                        name: req.body.name,
                        password: Pass,
                        isVerified: false,
                        isModo: false,
                        isAdmin: false,
                        isBan: false
                    },
                )
                res.render('home')
            } else {
                userCollection.create(
                    {
                        email: req.body.email,
                        name: req.body.name,
                        password: Pass,
                        image: `/public/ressources/images/${req.file.filename}`,
                        nameImage: req.file.filename,
                        isVerified: false,
                        isModo: false,
                        isAdmin: false,
                        isBan: false
                    },
                )
                res.render('home')
            }
        }
    },

    /**************Affichage page liste compte (temporaire car pour ensuite afficher page mon compte***************/
    getUserListing: async (req, res) => {
        const dbUser = await userCollection.find({})
        // console.log(dbUser);

        res.render('user/userListing', { dbUser })
    },

    /**************Affichage page mon compte***************/
    getUserSingle: async (req, res) => {
        const dbUser = await userCollection.find({})
        // console.log(dbUser);

        res.render('user/userSingle', { dbUser })
    },

    /**************Affichage page édition compte***************/
    getUserEdit: async (req, res) => {
        const dbUser = await userCollection.findById(req.params.id)
        // console.log(req.params.id);

        res.render('user/userEdit', { dbUser })
    },

    /**************Edition compte***************/
    putUserEdit: async (req, res) => {
        // console.log(req.params.id);
        const dbUser = await userCollection.findById(req.params.id);
        const pathImage = path.resolve("public/ressources/images/" + dbUser.nameImage)
        // console.log(req.file);

        if (!req.file) {
            if (req.body) {
                // console.log(req.body);
                userCollection.findOneAndUpdate(
                    { _id: req.params.id },
                    {
                        email: req.body.email,
                        name: req.body.name,
                    },
                    { multi: true },
                    (err) => {
                        if (err) {
                            res.redirect("/")
                        } else {
                            console.log('UPDATE OK');
                            res.redirect('/userEdit/' + req.params.id)
                        }
                    })
            } else {
                res.redirect("/")
                console.log('no req.body');
            }
        } else {
            // console.log(req.file);
            userCollection.findOneAndUpdate(
                { _id: req.params.id },
                {
                    email: req.body.email,
                    name: req.body.name,
                    image: `/public/ressources/images/${req.file.filename}`,
                    nameImage: req.file.filename,
                },
                { multi: true },
                (err, post) => {
                    fs.unlink(pathImage,
                        (err) => {
                            if (err) {
                                // res.redirect("/")
                                console.log(err);
                            } else {
                                console.log('File delete');
                                res.redirect('/userEdit/' + req.params.id)
                            }
                        })
                })
        }
    },

    /**************Suppression compte***************/
    deleteOneUser: async (req, res) => {
        // console.log(req.params.id);
        // console.log('delete Article')
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
                                // console.log("File delete");
                                res.redirect('/userListing')
                            }
                        }
                    )
                } else {
                    res.send(err)
                }
            })
    },
    // ATTENTION bien penser à mettre un form method POST et en action l'url puis "/?_method=delete" avec autour du bouton qui est en type submit

    /**************Affichage page se connecter***************/
    getUserAuth: (req, res) => {
        res.render('user/authentification')
    },

    /**************Connexion***************/
    postUserAuth: async (req, res) => {
        const dbUser = await userCollection.findOne({ email: req.body.email })
        if (!dbUser) {
            // console.log('pas dans la DB');
            res.redirect('/userCreate')
        } else {
            bcrypt.compare(req.body.password, dbUser.password, (err, same) => {
                if (!same) {
                    // console.log('mdp non correct');
                    res.redirect('/userCreate')
                } else {
                    res.redirect('/')
                }
            })
            // if (req.body.password != dbUser.password) {
            //     // console.log('mdp non correct');
            //     res.redirect('/userCreate')
            // } else {
            //     res.redirect('/')
            // }
        }
    }
}
