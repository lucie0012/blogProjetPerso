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
        // console.log(dbUserId);
        // console.log(dbUserId.isVerified);

        let userVerified = dbUserId != null ? dbUserId.isVerified : false;
        // condition ternaire
        // console.log(userVerified);



        res.render('repertory/repertory', {
            dbUserId: dbUserId,
            dbRepertory: dbRepertory,
            userVerified: userVerified
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
    putSite: (req, res) => {
        console.log(req.params.id);
        console.log(req.body);

        repertoryCollection.findOneAndUpdate(
            { _id: req.params.id },
            {
                title: req.body.title,
                url: req.body.url,
                content: req.body.content,
                category: req.body.category,
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

    /**************Suppression d'une note/commentaire ***************/
    postSiteFilter: async (req, res) => {
        // // console.log(req.body.category);

        // const search = req.body.category;
        // const dbRepertoryFilter = await repertoryCollection.find({ category : search })

        // // console.log(dbRepertoryFilter);

        // res.render('repertory/repertory', { dbRepertory : dbRepertoryFilter })

        // TEST OK : récupère pour sans gluten coché tout les sites où il y a sans gluten (même les sans gluten et sans lactose)
        // et pour sans gluten et sans lactose coché récupère les sites où il y a sans gluten ET sans lactose

        // console.log(req.body.category);

        const search = req.body.category;
        const dbRepertory = await repertoryCollection.find({})

        let dbRepertoryFilter;
        if (Array.isArray(search)) {
            console.log(1);
            dbRepertoryFilter = await repertoryCollection.find({ category: { $in: [search[0], search[1], search[2], search[3]] } })
        } else {
            console.log(2);

            dbRepertoryFilter = await repertoryCollection.find({ category: search })
        }

        // // console.log(dbRepertoryFilter);

        res.render('repertory/repertory', { dbRepertory: dbRepertoryFilter })

        // TEST 2 OK : récupère pour sans gluten et sans lactose coché : les sites où il y a sans gluten, 
        // sans lactose et sans gluten ET sans lactose / pour sans gluten coché : récupère les sites où il y a sans gluten (même les sans gluten et sans lactose)


        // console.log(req.body.category);

        // const search = req.body.category;
        // const dbRepertory = await repertoryCollection.find({})

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