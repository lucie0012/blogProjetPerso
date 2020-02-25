const actuCollection = require('../database/models/actuModel');

module.exports = {

    getActuCreate: (req, res) => {
        res.render('actu/actuCreate')
    },

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
                        image: `/assets/ressources/images/${req.file.filename}`
                    },
                    (err, post) => {
                        res.redirect('/actus')
                    })
                // console.log(req.body)
                // on redirige vers le lien /actus qui fait référence dans router à la route /actus et au get
            } else if (req.file.size > limitSize) {
                console.log('Pas bien');
                res.redirect('back')
            }
        }
    },

    getActu: async (req, res) => {
    // "async" car on utilise "await" pour attendre de récupérer les données
        const dbActu = await actuCollection.find({})
        // console.log(dbActu);

        res.render('actu/actus', { dbActu })
        // on renvoi la page "actus" avec les données de la BDD
    },
    // ATTENTION : dans la page actus, bien penser à mettre le "each" pour afficher tout les élements de la BDD et indiquer plusieurs infos (cf page actus)

    getActuSingle: async (req, res) => {
        const dbActu = await actuCollection.findById(req.params.id)
        // console.log(req.params.id);

        res.render('actu/actuSingle', { dbActu })
    },
    // ATTENTION : dans la page actu single, bien penser à indiquer à la place tu "titre", "content", etc.. "dbActu.title", "dbActu.content"


    deleteOneActuSingle: (req, res) => {
        // console.log(req.params.id);
        // console.log('delete Article')
        actuCollection.deleteOne(
            { _id: req.params.id },
            (err) => {
                if (!err) {
                    res.redirect('/actus')
                } else {
                    res.send(err)
                }
            })
    },
    // ATTENTION bien penser à mettre un form method POST et en action l'url puis "/?_method=delete" avec autour du bouton qui est en type submit

    putActuSingle: (req, res) => {
        // console.log(req.params.id);

        if (!req.file) {
            if (!req.body.title) {
                console.log('no req.body.title & no req.file')
                
            } else if (req.body.title) {
                console.log('req.body.title')

                actuCollection.findOneAndUpdate(
                    { _id: req.params.id },
                    {
                        title: req.body.title,
                        content: req.body.content,
                        createDate: req.body.date,
                    },
                    { multi: true },
                    (err) => {
                        if (!err) {
                            // console.log('UPDATE OK');
                            res.redirect('/actuSingle/' + req.params.id)
                        } else {
                            res.send(err)
                        }
                    })
            } else {
                console.log('no req.file');
            }

        } else {
            actuCollection.findOneAndUpdate(
                { _id: req.params.id },
                {
                    title: req.body.title,
                    content: req.body.content,
                    createDate: req.body.date,
                    image: `/assets/ressources/images/${req.file.filename}`
                },
                { multi: true },
                (err) => {
                    if (!err) {
                        // console.log('UPDATE OK');
                        res.redirect('/actuSingle/' + req.params.id)
                    } else {
                        res.send(err)
                    }
                })
        }
    }
}

