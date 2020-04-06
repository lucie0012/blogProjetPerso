/*
 * Middleware isAdmin
 **************************/

const userCollection = require('../api/database/models/userModel');

module.exports = (req, res, next) => {
    userCollection.findById(req.session.userId, (error, user) => {
        if (user && user.isAdmin == true && !error) {
            next()
        } else {
            console.log("n'est pas admin");
            return res.redirect('/')
        }
    })
}