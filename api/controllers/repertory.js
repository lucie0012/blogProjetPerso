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
        const dbRepertory = await (await repertoryCollection.find({})).reverse()    //double await suite au ".reverse()"
        //console.log(dbUserId);
        // console.log(dbUserId.isVerified);

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

        let userVerified = dbUserId != null ? dbUserId.isVerified : false;
        // condition ternaire
        // console.log(userVerified);

        res.render('repertory/repertory', {
            dbUserId: dbUserId,
            dbRepertory: dbRepertory,
            userVerified: userVerified,
            cookieGA: cookieGA,
            bandeauCookieGA: bandeauCookieGA
        })
    },

    /**************Création d'un site pour le répertoire ***************/
    postSiteCreate: (req, res) => {
        const limitSize = '1000000'
        // console.log(req.body)

        if (!req.file) {
            console.log("pas de photo");
            repertoryCollection.create(
                {
                    title: req.body.title,
                    url: req.body.url,
                    content: req.body.content,
                    category: req.body.category,
                    authorId: req.session.userId,
                },
                (err, post) => {
                    res.redirect('back')
                })
        } else {
            if (req.file.size < limitSize) {
                // console.log(req.file)
                // console.log(req.file.size)
                console.log('Size photo OK');
                repertoryCollection.create(
                    {
                        title: req.body.title,
                        url: req.body.url,
                        content: req.body.content,
                        category: req.body.category,
                        authorId: req.session.userId,
                        image: `/public/ressources/images/${req.file.filename}`,
                        nameImage: req.file.filename
                    },
                    (err, post) => {
                        if (err) {
                            res.send(err)
                        } else {
                            res.redirect('back')
                            // 'back' permet de revenir à la page précédente
                        }
                    })
            } else if (req.file.size > limitSize) {
                console.log('Size photo not OK');
                res.redirect('back')
            }
        }

        // console.log(req.body)
        // console.log(req.body.category)
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
    putSite: async (req, res) => {
        // console.log(req.params.id);
        // console.log(req.body);

        const dbRepertory = await repertoryCollection.findById(req.params.id);
        const pathImage = path.resolve("public/ressources/images/" + dbRepertory.nameImage)
        // console.log(req.file);
        // console.log(dbUser.nameImage);

        if (!req.file) {
            if (req.body) {
                // console.log(req.body);
                repertoryCollection.findOneAndUpdate(
                    { _id: req.params.id },
                    {
                        title: req.body.title,
                        url: req.body.url,
                        content: req.body.content,
                        category: req.body.category,
                    },
                    { multi: true },
                    (err) => {
                        if (err) {
                            res.send(err)
                        } else {
                            console.log('UPDATE OK');
                            res.redirect('back')
                        }
                    })
            } else {
                res.redirect("back")
                console.log('no req.body');
            }
        } else if (dbRepertory.nameImage == null) {
            repertoryCollection.findOneAndUpdate(
                { _id: req.params.id },
                {
                    title: req.body.title,
                    url: req.body.url,
                    content: req.body.content,
                    category: req.body.category,
                    image: `/public/ressources/images/${req.file.filename}`,
                    nameImage: req.file.filename,
                },
                { multi: true },
                (err) => {
                    if (err) {
                        console.log(err);
                        res.send(err)
                    } else {
                        console.log('File MAJ');
                        res.redirect("back")
                    }
                })
        } else {
            repertoryCollection.findOneAndUpdate(
                { _id: req.params.id },
                {
                    title: req.body.title,
                    url: req.body.url,
                    content: req.body.content,
                    category: req.body.category,
                    image: `/public/ressources/images/${req.file.filename}`,
                    nameImage: req.file.filename,
                },
                { multi: true },
                (err, post) => {
                    fs.unlink(pathImage,
                        (err) => {
                            if (err) {
                                console.log(err);
                                res.send(err)
                            } else {
                                console.log('New img OK and old File delete');
                                res.redirect("back")

                            }
                        })
                })
        }
    },

    /**************Suppression d'un site pour le répertoire ***************/
    deleteOneSite: async (req, res) => {
        // console.log(req.params.id);

        const dbRepertory = await repertoryCollection.findById(req.params.id);
        const pathImage = path.resolve("public/ressources/images/" + dbRepertory.nameImage)
        // console.log(dbUser);
        // console.log(dbUser.nameImage);


        if (dbRepertory.nameImage == null) {
            // mettre undefined plutôt ??
            console.log("pas d'image");
            repertoryCollection.deleteOne(
                { _id: req.params.id },
                (err) => {
                    if (err) {
                        console.log(err);
                        res.send(err)
                    } else {
                        console.log("Site delete");
                        noteCollection.deleteMany(
                            { siteId: req.params.id },
                            (err) => {
                                if (err) {
                                    res.send(err)
                                    console.log('suppression pas OK');
                                } else {
                                    res.redirect('/admin')
                                    console.log('suppression note/comm OK');
                                }
                            })
                        // res.redirect('/admin')
                    }
                })
        } else {
            repertoryCollection.deleteOne(
                { _id: req.params.id },
                (err) => {
                    if (err) {
                        res.send(err)
                    } else {
                        fs.unlink(pathImage,
                            (err) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log("Site and File delete");
                                    noteCollection.deleteMany(
                                        { siteId: req.params.id },
                                        (err) => {
                                            if (err) {
                                                res.send(err)
                                                console.log('suppression pas OK');
                                            } else {
                                                res.redirect('/admin')
                                                console.log('suppression note/comm OK');
                                            }
                                        })
                                    // res.redirect('/admin')
                                }
                            }
                        )
                    }
                })
        }

    },

    /**************Création d'une note ***************/
    postNote: (req, res) => {
        noteCollection.create(
            {
                note: req.body.note,
                comment: req.body.comment,
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
        // console.log(req.body)
        // console.log(req.params.id)
        // console.log(req.session);

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

    /**************Suppression d'une note/commentaire ***************/
    postSiteFilter: async (req, res) => {
        // const dbUserId = await userCollection.findById(req.session.userId)
        // // console.log(req.body.category);

        // let userVerified = dbUserId != null ? dbUserId.isVerified : false;
        // // condition ternaire
        // // console.log(userVerified);

        // const search = req.body.category;
        // // console.log(search);


        // let dbRepertoryFilter;
        // if (search == undefined) {
        //     dbRepertoryFilter = await repertoryCollection.find({})
        // } else {
        //     dbRepertoryFilter = await repertoryCollection.find({ category: search })
        // }

        // let isEmpty = false;
        // if (dbRepertoryFilter.length === 0) {
        //     isEmpty = true;
        // }
        // // console.log(dbRepertoryFilter);

        // res.render('repertory/filterRepertory', {
        //     layout: '',
        //     userVerified: userVerified,
        //     dbRepertory: dbRepertoryFilter,
        //     dbUserId: dbUserId,
        //     isEmpty: isEmpty
        // })

        // // res.json({
        // //     dbRepertory: dbRepertoryFilter,
        // //     dbUserId: dbUserId
        // // })

        // // TEST OK : récupère pour sans gluten coché tout les sites où il y a sans gluten (même les sans gluten et sans lactose)
        // // et pour sans gluten et sans lactose coché récupère les sites où il y a sans gluten ET sans lactose

        // // console.log(req.body.category);

        // const dbUserId = await userCollection.findById(req.session.userId)

        // let userVerified = dbUserId != null ? dbUserId.isVerified : false;
        // // condition ternaire
        // // console.log(userVerified);

        // const search = req.body.category;
        // // const dbRepertory = await repertoryCollection.find({})

        // let dbRepertoryFilter;
        // if (search == undefined) {
        //     dbRepertoryFilter = await repertoryCollection.find({})
        // } else if (Array.isArray(search)) {
        //     // console.log(1);
        //     dbRepertoryFilter = await repertoryCollection.find({ category: { $in: [search[0], search[1], search[2], search[3]] } })
        // } else {
        //     // console.log(2);

        //     dbRepertoryFilter = await repertoryCollection.find({ category: search })
        // }

        // let isEmpty = false;
        // if (dbRepertoryFilter.length === 0) {
        //     isEmpty = true;
        // }

        // // console.log(dbRepertoryFilter);

        // res.render('repertory/filterRepertory', {
        //     layout: '',
        //     userVerified: userVerified,
        //     dbRepertory: dbRepertoryFilter,
        //     dbUserId: dbUserId,
        //     isEmpty: isEmpty
        // })

        // // TEST 2 OK : récupère pour sans gluten et sans lactose coché : les sites où il y a sans gluten, 
        // // sans lactose et sans gluten ET sans lactose / pour sans gluten coché : récupère les sites où il y a sans gluten (même les sans gluten et sans lactose)

        const dbUserId = await userCollection.findById(req.session.userId)
        // console.log(req.body.category);

        let userVerified = dbUserId != null ? dbUserId.isVerified : false;
        // condition ternaire
        // console.log(userVerified);

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

        const search = req.body.category;
        // console.log(search);


        let dbRepertoryFilter;
        if (search == undefined) {
            dbRepertoryFilter = await repertoryCollection.find({})
        } else if (search.length == 1) {
            dbRepertoryFilter = await repertoryCollection.find({ category: { $in: [search[0]] } })
        } else {
            dbRepertoryFilter = await repertoryCollection.find({ category: search })
        }

        let isEmpty = false;
        if (dbRepertoryFilter.length === 0) {
            isEmpty = true;
        }
        // console.log(dbRepertoryFilter);

        res.render('repertory/filterRepertory', {
            layout: '',
            userVerified: userVerified,
            dbRepertory: dbRepertoryFilter,
            dbUserId: dbUserId,
            isEmpty: isEmpty,
            cookieGA: cookieGA,
            bandeauCookieGA: bandeauCookieGA
        })

        // TEST 3 OK : pour que sans gluten récupère tout ceux où il y a sans gluten / pour le reste récupère que si les 2 sont présent

        // console.log(req.body.category);

        // const search = req.body.category;
        // const dbRepertory = await repertoryCollection.find({})

        // let userVerified = dbUserId != null ? dbUserId.isVerified : false;
        // // condition ternaire
        // // console.log(userVerified);

        // let dbRepertoryFilter;
        // if (Array.isArray(search)) {
        //     console.log(1);

        //     dbRepertoryFilter = await repertoryCollection.find({ category: { $in: [search[0], search[1]] } })
        // } else {
        //     console.log(2);

        //     dbRepertoryFilter = await repertoryCollection.find({ category: search })
        // }

        // console.log(dbRepertoryFilter);
        // console.log(search);
        // console.log(search[0]);
        // console.log(dbRepertory.category);

        // if (search == "sansGluten") {
        //     console.log("test 1");
        // } else if ((search == "sansGluten" & search == "sansLactose")) {
        //     console.log("test 2");
        // }

        // res.redirect('/admin')

    },

}