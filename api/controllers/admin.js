const userCollection = require('../database/models/userModel');

module.exports = {
    getUserList: async (req, res) => {
        const dbUser = await userCollection.find({})
        // console.log(dbUser);

        res.render('admin/adminUserList', { dbUser })
    },

    getUserEdit: async (req, res) => {
        const dbUser = await userCollection.findById(req.params.id)
        // console.log(req.params.id);

        res.render('admin/adminUserEdit', { dbUser })
    },

    putlistUser: (req, res) => {
        // console.log(req.body.role);
        // console.log(req.params.id);
        if (req.body.role === 'isAdmin') {
            // "role" est le name du "select" dans la page adminUserEdit
            userCollection.findOneAndUpdate(
                { _id: req.params.id },
                {
                    status: "Administrateur",
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
                    status: "Modérateur",
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
                    status: "Vérifié",
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
                    status: "Bannis",
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