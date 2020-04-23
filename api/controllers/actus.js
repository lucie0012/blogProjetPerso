const actuCollection = require('../database/models/actuModel');
const userCollection = require('../database/models/userModel');
const commentCollection = require('../database/models/commentModel');


const path = require('path');
// pour gestion suppression image
const fs = require('fs')
// pour gestion suppression image


module.exports = {

    /**************Création d'article***************/
    postActuCreate: (req, res) => {
        const limitSize = '1000000'
        // console.log(req.file.size)
        if (!req.file) {
            res.redirect('/')
        } else {
            if (req.file.size < limitSize) {
                // console.log('Bien');
                actuCollection.create(
                    {
                        title: req.body.title,
                        content: req.body.content,
                        image: `/public/ressources/images/${req.file.filename}`,
                        nameImage: req.file.filename
                    },
                    (err, post) => {
                        res.redirect('/actus')
                    })
                // console.log(req.body)
                // on redirige vers le lien /actus qui fait référence dans router à la route /actus et au get
            } else if (req.file.size > limitSize) {
                // console.log('Pas bien');
                res.redirect('back')
            }
        }
    },

    /**************Affichage page de tous les articles***************/
    getActu: async (req, res) => {
        // "async" car on utilise "await" pour attendre de récupérer les données
        const dbActu = await actuCollection.find({})
        // console.log(dbActu);
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

        res.render('actu/actus', {
            dbActu: dbActu,
            dbUserId: dbUserId,
            cookieGA: cookieGA,
            bandeauCookieGA: bandeauCookieGA
        })
        // on renvoi la page "actus" avec les données de chaque BDD nécessaire dans cette page
    },
    // ATTENTION : dans la page actus, bien penser à mettre le "each" pour afficher tout les élements de la BDD et indiquer plusieurs infos (cf page actus)


    /**************Affichage page article seul***************/
    getActuSingle: async (req, res) => {
        const dbActu = await actuCollection.findById(req.params.id)
        // console.log(req.params.id);
        const dbUserId = await userCollection.findById(req.session.userId)
        const dbComment = await commentCollection.find({ articleId: req.params.id })

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

        for (let i in dbComment) {
            if (dbComment[i].authorId == null) {
                dbComment[i].pseudoAuthor = "anonyme";
            } else {
                const dbUserIdauthorIdComment = await userCollection.findById(dbComment[i].authorId)
                dbComment[i].pseudoAuthor = dbUserIdauthorIdComment.pseudo;

                // console.log(i + "coucou 1 " + dbComment[i].pseudoAuthor)
            }
        }


        res.render('actu/actuSingle', {
            dbActu: dbActu,
            dbUserId: dbUserId,
            dbComment: dbComment,
            cookieGA: cookieGA,
            bandeauCookieGA: bandeauCookieGA
        })
    },
    // ATTENTION : dans la page actu single, bien penser à indiquer à la place tu "titre", "content", etc.. "dbActu.title", "dbActu.content"


    /**************Suppression d'article***************/
    deleteOneActuSingle: async (req, res) => {
        // console.log(req.params.id);
        const dbActu = await actuCollection.findById(req.params.id);
        const pathImage = path.resolve("public/ressources/images/" + dbActu.nameImage)

        // console.log(dbComment);

        actuCollection.deleteOne(
            { _id: req.params.id },
            (err) => {
                if (!err) {
                    fs.unlink(pathImage,
                        (err) => {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log("File delete");

                                commentCollection.deleteMany(
                                    { articleId: req.params.id },
                                    (err) => {
                                        if (err) {
                                            res.send(err)
                                            console.log('suppression pas OK');
                                        } else {
                                            res.redirect('/admin')
                                            console.log('suppression comm OK');
                                        }
                                    })
                                // res.redirect('/admin')
                            }
                        }
                    )
                } else {
                    res.send(err)
                }
            })
    },
    // ATTENTION bien penser à mettre un form method POST et en action l'url puis "/?_method=delete" avec autour du bouton qui est en type submit

    /**************Edition d'article***************/
    putActuSingle: async (req, res) => {
        // console.log(req.params.id);
        const dbActu = await actuCollection.findById(req.params.id);
        const pathImage = path.resolve("public/ressources/images/" + dbActu.nameImage)
        // console.log(req.file);

        if (!req.file) {
            if (req.body.title) {
                // console.log(req.body);
                actuCollection.findOneAndUpdate(
                    { _id: req.params.id },
                    {
                        title: req.body.title,
                        content: req.body.content,
                        createDate: req.body.date,
                    },
                    { multi: true },
                    (err) => {
                        if (err) {
                            res.redirect("/")
                        } else {
                            console.log('UPDATE OK');
                            res.redirect('/actuSingle/' + req.params.id)
                        }
                    })
            } else {
                res.redirect("/")
                console.log('no req.body');
            }
        } else {
            // console.log(req.file);
            actuCollection.findOneAndUpdate(
                { _id: req.params.id },
                {
                    title: req.body.title,
                    content: req.body.content,
                    createDate: req.body.date,
                    image: `/public/ressources/images/${req.file.filename}`,
                    nameImage: req.file.filename
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
                                res.redirect('/actuSingle/' + req.params.id)
                            }
                        })
                })
        }
    },

    /**************Création de commentaire***************/
    postActuComment: (req, res) => {
        commentCollection.create(
            {
                content: req.body.content,
                authorId: req.session.userId,
                articleId: req.params.id,
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

    /**************Validation de commentaire***************/
    putActuComment: (req, res) => {
        // console.log(req.params.id);

        commentCollection.findOneAndUpdate(
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


    /**************Suppression de commentaire***************/
    deleteOneComment: (req, res) => {
        // console.log(req.params.id);

        commentCollection.deleteOne(
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
