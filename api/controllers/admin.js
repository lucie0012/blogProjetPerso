const userCollection = require('../database/models/userModel');

module.exports = {

    /**************Affichage page admin***************/
    getAdmin: async (req, res) => {
        const dbUserId = await userCollection.findById(req.session.userId)
        const dbUser = await userCollection.find({})
        res.render('admin/admin' , { dbUserId: dbUserId, dbUser: dbUser })
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
            // "role" est le name du "select" dans la page adminUserEdit
            userCollection.findOneAndUpdate(
                { _id: req.params.id },
                {
                    fonction: "Administrateur",
                    isVerified: true,
                    isModo: true,
                    isAdmin: true,
                    isBan: false
                },
                { multi: true },
                (err) => {
                    if (!err) {
                        res.redirect('/adminUserList')
                    } else {
                        res.rend(err)
                    }
                }
            )
        } else if (req.body.role === 'isModo') {
            userCollection.findOneAndUpdate(
                { _id: req.params.id },
                {
                    fonction: "Modérateur",
                    isVerified: true,
                    isModo: true,
                    isAdmin: false,
                    isBan: false
                },
                { multi: true },
                (err) => {
                    if (!err) {
                        res.redirect('/adminUserList')
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
                    isModo: false,
                    isAdmin: false,
                    isBan: false
                },
                { multi: true },
                (err) => {
                    if (!err) {
                        res.redirect('/adminUserList')
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
                    isModo: false,
                    isAdmin: false,
                    isBan: true
                },
                { multi: true },
                (err) => {
                    if (!err) {
                        res.redirect('/adminUserList')
                    } else {
                        res.rend(err)
                    }
                }
            )
        }
    },

    /**************Suppression utilisateur pour admin***************/
    deleteOneUser: (req, res) => {
        userCollection.deleteOne(
            { _id: req.params.id },
            (err) => {
                if (!err) {
                    res.redirect('/adminUserList')
                } else {
                    res.send(err)
                }
            })
    }
}