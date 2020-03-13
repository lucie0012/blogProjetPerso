const userCollection = require('../database/models/userModel');
const path = require('path');
// pour gestion suppression image
const fs = require('fs')
// pour gestion suppression image
const bcrypt = require('bcrypt')
// pour compare password chiffré

module.exports = {

    /**************Création compte*************/
    postUserCreate: (req, res) => {
        // console.log(req.body);
        const Pass = req.body.password
        const confPass = req.body.confPassword
        // console.log(Pass + ' ' + confPass);

        if (Pass !== confPass) {
            //comparaison des mots de passe
            res.redirect('/')
            // res.render('user/userCreate')
        } else {
            if (!req.file) {
                userCollection.create(
                    {
                        email: req.body.email,
                        name: req.body.name,
                        pseudo: req.body.pseudo,
                        password: Pass,
                        isVerified: false,
                        isAdmin: false,
                        isBan: false
                    },
                )
                res.redirect('/')
            } else {
                userCollection.create(
                    {
                        email: req.body.email,
                        name: req.body.name,
                        pseudo: req.body.pseudo,
                        password: Pass,
                        image: `/public/ressources/images/${req.file.filename}`,
                        nameImage: req.file.filename,
                        isVerified: false,
                        isAdmin: false,
                        isBan: false
                    },
                )
                res.redirect('/')
            }
        }
    },


    /**************Edition compte***************/
    putUserEdit: async (req, res) => {
        console.log(req.params.id);
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
                        pseudo: req.body.pseudo,
                        name: req.body.name,
                    },
                    { multi: true },
                    (err) => {
                        if (err) {
                            res.redirect("/")
                        } else {
                            console.log('UPDATE OK');
                            res.redirect('/')
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
                    pseudo: req.body.pseudo,
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
                                res.redirect('/')
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
        // console.log(dbUser);

        if (dbUser.nameImage == null) {
            // console.log("pas d'image");
            userCollection.deleteOne(
                { _id: req.params.id },
                (err) => {
                    if (!err) {
                        // console.log("User delete");
                        // res.redirect('/')
                        res.render('home')
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
                                    // console.log("User and File delete");
                                    // res.redirect('/')
                                    res.render('home')
                                }
                            }
                        )
                    } else {
                        res.send(err)
                    }
                })
        }

    },
    // ATTENTION bien penser à mettre un form method POST et en action l'url puis "/?_method=delete" avec autour du bouton qui est en type submit

    /**************Connexion***************/
    postUserAuth: async (req, res) => {
        const { email, password } = req.body
        // comme si on faisait const email = req.body. email et const password = req.body.password
        const dbUser = await userCollection.findOne({ email })

        if (!dbUser) {
            console.log('user pas dans la DB');
            res.redirect('/userCreate')
        } else {
            const sess = req.session
            // console.log(req.body)
            // console.log(sess);

            bcrypt.compare(password, dbUser.password, (err, same) => {
                if (!same) {
                    console.log('mdp non correct');
                    res.redirect('back')
                } else {
                    sess.userId = dbUser._id
                    sess.status = dbUser.status
                    sess.name = dbUser.name
                    sess.pseudo = dbUser.pseudo
                    sess.email = dbUser.email
                    sess.fonction = dbUser.fonction
                    sess.isVerified = dbUser.isVerified
                    sess.isAdmin = dbUser.isAdmin
                    sess.isModo = dbUser.isModo
                    sess.isBan = dbUser.isBan
                    // console.log(sess);
                    res.redirect('/')
                }
            })
        }
    },

    /**************Déconnexion***************/
    getLogOut: (req, res, next) => {
        req.session.destroy(() => {
            res.clearCookie('clear cookie OK');
            res.redirect('/')
        })
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
