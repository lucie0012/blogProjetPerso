/*
 * Import
 ***********/
const express = require('express')
const router = express.Router()

/*
 * Import Controllers
 ***********/
const home = require('./controllers/home')
const actus = require('./controllers/actus')
const repertory = require('./controllers/repertory')
const contact = require('./controllers/contact')
const about = require('./controllers/about')
const user = require('./controllers/user')
const admin = require('./controllers/admin')
const password = require('./controllers/password')
const cookie = require('./controllers/cookie')


/*
 * Import Middleware
 *******************/
const multer = require('../middleware/multer-config')
const isAdmin = require('../middleware/isAdmin')
const isVerified = require('../middleware/isVerified')



/*
 * Home
 ***********/
router.route('/')
    .get(home.getHome)


/*
 * Cookie
 ***********/
// Création cookie acceptation google analytics
router.route('/newCookieGA')
    .get(cookie.newCookieGA)
// Refus cookie acceptation google analytics
router.route('/refuseCookieGA')
    .get(cookie.refuseCookieGA)
// Suppression cookie acceptation google analytics
router.route('/clearCookieGA')
    .post(cookie.clearCookieGA)



/*
 * Footer
 ***********/
// Affichage page conditions générales d'utilisations
router.route('/termsOfService')
    .get(home.getTermsOfService)
// Affichage page mentions légales
router.route('/legalNotice')
    .get(home.getLegalNotice)
// Affichage page de gestion des préférences cookies
router.route('/managingCookiesPreferences')
    .get(home.getManagingCookiesPreferences)

    



/*
 * Actus
 ***********/
// Affichage des actus et création d'actu
router.route('/actus')
    .get(actus.getActu)
    .post(isAdmin, multer, actus.postActuCreate)

// Affichage, gestion et suppression actus single
router.route('/actuSingle/:id')
    .get(actus.getActuSingle)
    .delete(isAdmin, actus.deleteOneActuSingle)
    .put(isAdmin, multer, actus.putActuSingle)
// s'il y a un middleware à ajouter c'est avant le actus.deleteOneActuSingle / ex : .get(auth, actus.getActuSingle) : auth étant un middleware



/*
 * Comment
 ***********/
// Création, validation et suppression
router.route('/commentaireActu/:id')
    .post(isVerified, actus.postActuComment)
    .put(isAdmin, actus.putActuComment)
    .delete(isAdmin, actus.deleteOneComment)



/*
 * Répertoire
 ****************/
// Affichage page répertoire et création site/répertoire
router.route('/repertory')
    .get(repertory.getRepertory)
    .post(isVerified, multer, repertory.postSiteCreate)

// Filtre par catégorie
router.route('/repertoryFilter')
    .post(repertory.postSiteFilter)

// Edition de site/répertoire et suppression
router.route('/repertory/:id')
    .put(isAdmin, multer, repertory.putSite)
    .delete(isAdmin, repertory.deleteOneSite)

// Validation de site/répertoire
router.route('/repertoryValid/:id')
    .put(isAdmin, repertory.putSiteValid)



/*
 *Note
 ****************/
// Création, validation et suppression de note/commentaire
router.route('/note/:id')
    .post(isVerified, repertory.postNote)
    .put(isAdmin, repertory.putNoteValid)
    .delete(isAdmin, repertory.deleteOneNote)



/*
 * Contact
 ************/
// Affichage page contact et envoi message
router.route('/contact')
    .get(contact.getContact)
    .post(contact.postMessage)

// Suppression d'un message
router.route('/contact/:id')
    .delete(isAdmin, contact.deleteOneMessage)



/*
 * About
 ***********/
// Affichage page a propos
router.route('/about')
    .get(about.getAbout)



/*
 * User
 ***********/
// Création de compte
router.route('/userCreate')
    .post(multer, user.postUserCreate)

// Check mail avant Création de compte (pour doublon)
router.route('/checkMail')
    .post(user.checkMail)

// Vérification mail via nodemailer
router.route('/verifyMail/:id') //lien créé dans user.js dans la config nodemailer du postUserCreate (id : correspond au chiffre random)
    .get(user.getVerifyMail)

router.route('/verifyMail')
    .get(user.getConfirmVerifyMail)

// Connexion
router.route('/authentification')
    .post(user.postUserAuth)

// Gestion compte : modification et suppression
router.route('/userEdit/:id')
    .put(multer, user.putUserEdit)
// .delete(user.deleteOneUser)

// Suppression compte : modification des status pour conservation données après suppression compte (à conserver le temps demandé par rgpd?)
router.route('/userEditDelete/:id')
    .put(user.putUserEditDelete)

// Déconnexion
router.route('/userLogOut')
    .get(user.getLogOut)


/*
 * Password
 **************/
// Réinitialisation mot de passe via nodemailer
router.route('/forgotPassword')
    .get(password.getForgotPassword)
    .post(password.postForgotPassword)

// Réinitialisation mot de passe via nodemailer
router.route('/resetPassword/:id')  //(id : correspond au chiffre random)
    .get(password.getResetPassword)
    .post(password.postResetPassword)


/*
 * Admin
 ***********/
// Affichage page admin
router.route('/privateAdmin')
    .get(isAdmin, admin.getAdmin)

// Edition utilisateur en isVerified par admin
router.route('/verifiedUser/:id')
    .put(isAdmin, admin.putVerifiedUser)

// Gestion des utilisateurs par admin
router.route('/adminUserEdit/:id')
    .put(isAdmin, admin.putlistUser)
    .delete(isAdmin, admin.deleteOneUserAdmin)

router.route('/adminUserEditDelete/:id')
    .put(isAdmin, admin.putUserEditDelete)



module.exports = router
