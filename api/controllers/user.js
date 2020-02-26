const userCollection = require('../database/models/userModel');
const path = require('path');
// pour gestion suppression image
const fs = require('fs')
// pour gestion suppression image

module.exports = {
    getUserCreate: (req, res) => {
        res.render('user/userCreate')
    },

    postUserCreate: (req, res) => {
        // console.log(req.body);
        const Pass = req.body.password
        const confPass = req.body.confPassword
        // console.log(Pass + ' ' + confPass);

        if (Pass !== confPass) {
            //comparaison des mots de passe
            res.redirect('/userCreate')
            // "back" indique la page 
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

    getUserList: async (req, res) => {
        const dbUser = await userCollection.find({})
        // console.log(dbUser);

        res.render('user/userList', { dbUser })
    },

    getUserEdit: async (req, res) => {
        const dbUser = await userCollection.findById(req.params.id)
        // console.log(req.params.id);

        res.render('user/userEdit', { dbUser })
    },

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
                                res.redirect('/userList')
                            }
                        }
                    )
                } else {
                    res.send(err)
                }
            })
    },
    // ATTENTION bien penser à mettre un form method POST et en action l'url puis "/?_method=delete" avec autour du bouton qui est en type submit

}
