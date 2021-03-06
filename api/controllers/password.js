const userCollection = require('../database/models/userModel');
const bcrypt = require('bcrypt');
// pour compare password chiffré
const nodemailer = require('nodemailer');
// pour utiliser nodemailer
const config = require('../config/config');
// import fichier config pour mail/mdp nodemailer
const meta = require('./meta');


/**************Paramétrage nodemailer*************/
// création du transporteur nodemailer
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",     //nom d'hôte à laquelle se connecter (ici en protocole SMTP)
    service: 'gmail',   //précision de l'adresse mail utilisé : ici gmail
    port: 587,  //port auquel se connecter (par défaut pour le protocole SMTP : 587 si "secure" est "false" ou 465 si "true")
    secure: false,  //si "true", la connexion utilisera TLS lors de la connexion au serveur. 
    // Si "false" (par défaut), TLS est utilisé si le serveur prend en charge l'extension STARTTLS (laisser sur false lors de l'utilisation des ports 587 et 25)
    auth: {
        // définission des données d'authentification
        user: config.nodemailer.email,
        pass: config.nodemailer.password,
    },
    tls: {
        rejectUnauthorized: false,  //définit des options TLSSocket node.js supplémentaires à transmettre au constructeur de socket
        // S'il n'est pas en "false", le serveur rejettera toute connexion non autorisée avec la liste des autorités de certification fournies
    }
})

let randForgotPass, mailOptionsForgotPass, hostForgotPass, linkForgotPass   //création de variable sans affectation (pour utilisation à suivre)
let mailOptionsResetPass, linkResetPass    //création de variable sans affectation (pour utilisation à suivre)

module.exports = {

    /**************Affichage page réinitialisation mot de passe***************/
    getForgotPassword: async (req, res) => {
        const title = meta.forgotPassword.title;
        const description = meta.forgotPassword.description;

        const dbUserId = await userCollection.findById(req.session.userId);

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

        res.render('user/forgotPassword', {
            cookieGA: cookieGA,
            bandeauCookieGA: bandeauCookieGA,
            dbUserId: dbUserId,
            title: title,
            description: description
        })
    },


    /**************Envoi mail réinitialisation mot de passe***************/
    postForgotPassword: async (req, res) => {
        // Nodemailer config et affectation des constantes declarées plus haut
        randForgotPass = Math.floor((Math.random() * 100) + 53)   //créer un chiffre random qui servira d'ID
        hostForgotPass = req.get('host')  // adresse du site hébergeant l'envoi du mail de verif (req.get est une fonction avec en paramètre ici 'host' (vu par une console log de "req.get"))
        linkForgotPass = "http://" + req.get('host') + "/resetPassword/" + randForgotPass  // construction du lien (qui servira de lien de validation dans le mail) avec l'adresse du site et le chiffre random
        mailOptionsForgotPass = {
            from: config.nodemailer.email, // adresse du mail qui envoi le lien de verif
            to: req.body.email, // adresse de la personne à qui envoyer (celle de l'utilisateur qui s'inscrit)
            subject: 'Votre demande de réinitialisation de mot de passe', // sujet du mail de verif
            randForgotPass: randForgotPass, // nombre random généré à l'envoi du mail
            html: "Bonjour.<br> Merci de cliquer sur le lien ci-dessous pour réinitialiser votre mot de passe <br><a href=" + linkForgotPass + ">Cliquer ici pour le réinitialiser</a> <br>L'équipe Blog Sans Allergenes",  // contenu du mail
        }

        // console.log("link :" + linkForgotPass);   //donne : "http://localhost:5000/resetPassword/142" (ici 142 est l'un des chiffre random)
        // console.log("host :" + hostForgotPass);   //donne : "localhost:5000"
        // console.log("mailOptions.to : " + mailOptionsForgotPass.to);  //donne l'adresse mail renseigné lors de la création du compte

        const title = meta.forgotPassword.title;
        const description = meta.forgotPassword.description;

        const dbUserId = await userCollection.findById(req.session.userId);

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

        const email = req.body.email
        // console.log(req.body.email)

        const user = await userCollection.findOne({ email })
        // console.log(user);

        let errorUserNotExist = false;
        let needAlertSend = false;

        if (!user) {
            console.log('user pas dans la DB');
            errorUserNotExist = true;
            //res.redirect('/')
            res.render('user/forgotPassword', {
                errorUserNotExist: errorUserNotExist,
                cookieGA: cookieGA,
                bandeauCookieGA: bandeauCookieGA,
                dbUserId: dbUserId,
                title: title,
                description: description
            })
        } else {
            needAlertSend = true;
            let isError;
            transporter.sendMail(mailOptionsForgotPass, (err, res, next) => { // utilisation de la constante transporter et de la fonction d'envoi de mail avec en paramètre les options mail prédéfini (afin de les envoyer dans le mail (ne le sont qu'au 1er clic))
                if (err) {
                    isError = true;
                    console.error("ERREUR :" + err);
                    res.render('user/forgotPassword', {
                        needAlertSend: needAlertSend,
                        isError: isError,
                        cookieGA: cookieGA,
                        bandeauCookieGA: bandeauCookieGA,
                        dbUserId: dbUserId,
                        title: title,
                        description: description
                    })
                } else {
                    console.log('Message envoyé');
                    next()
                }
            }),
                isError = false;
            //console.log(isError);
            res.render('user/forgotPassword', {
                needAlertSend: needAlertSend,
                isError: isError,
                cookieGA: cookieGA,
                bandeauCookieGA: bandeauCookieGA,
                dbUserId: dbUserId,
                title: title,
                description: description
            })
        }
        // res.redirect('/')
    },


    /**************Affichage page création nouveau mot de passe suite lien***************/
    getResetPassword: async (req, res) => {
        const title = meta.resetPassword.title;
        const description = meta.resetPassword.description;

        const dbUserId = await userCollection.findById(req.session.userId);

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

        // console.log("1 get");
        // console.log("mailOptionsForgotPass.to :" + mailOptionsForgotPass.to);
        // console.log(req.get('host'));
        // console.log("ID : " + req.params.id)
        // console.log("RAND : " + mailOptionsForgotPass.randForgotPass);

        const dbUser = await userCollection.findOne({ email: mailOptionsForgotPass.to })  //recherche de l'utilisateur concerné par l'email (celui à qui on envoi et donc celui recup via req.body lors du post)
        // console.log("user :" + user);

        if ((req.protocol + "://" + req.get('host')) == ("http://" + hostForgotPass)) {   //compare le lien utilisé pour venir sur la page (celui généré par le clic sur le lien dans le mail) et celui de notre site 
            console.log("Domain is matched. Information is from Authentic email")

            if (req.params.id == mailOptionsForgotPass.randForgotPass) {    //récupère dans l'url l'id (qui est censé être le numéro random généré pour le lien dans le mail) et le compare au même randon généré dans les options de l'envoi du mail
                console.log("Rand is matched. Information is from Authentic email")

                res.render('user/resetPassword', {
                    // renvoi des données user (via dbUser) sur la page afin de pouvoir y récupérer l'id dans l'url afin de pouvoir cibler l'user (via req.params.id) et submit sur le bon user
                    dbUser: dbUser,
                    dbUserId: dbUserId,
                    cookieGA: cookieGA,
                    bandeauCookieGA: bandeauCookieGA,
                    title: title,
                    description: description
                })

            } else {
                res.send("Bad Request")
            }
        } else {
            res.send('Request is from unknow source')
        }

    },

    /**************Création nouveau mot de passe***************/
    postResetPassword: async (req, res) => {
        const title = meta.resetPassword.title;
        const description = meta.resetPassword.description;

        const dbUserId = await userCollection.findById(req.session.userId);

        // console.log(req.cookies);
        let cookieGA = false
        let bandeauCookieGA = true

        if (req.cookies.cookieGA === 'accept') {
            cookieGA = true
            bandeauCookieGA = false
        } else if (req.cookies.cookieGA === 'refuse') {
            bandeauCookieGA = false
        }
        // console.log("2 post");
        // console.log(req.body);
        // console.log("ID : " + req.params.id)

        const user = await userCollection.findById(req.params.id)  //recherche de l'utilisateur concerné par l'email (celui à qui on envoi et donc celui recup via req.body lors du post)
        // console.log("user" + user);

        // Nodemailer config et affectation des constantes declarées plus haut
        linkResetPass = "http://" + req.get('host')
        mailOptionsResetPass = {
            from: config.nodemailer.email, // adresse du mail qui envoi le lien de verif
            to: user.email, // adresse de la personne à qui envoyer (celle de l'utilisateur qui s'inscrit)
            subject: 'Confirmation de réinitialisation de mot de passe', // sujet du mail de verif
            html: "Bonjour.<br> Votre mot de passe a bien été réinitialisé.<br><a href=" + linkResetPass + ">Revenir sur le site et se connecter</a> <br>L'équipe Blog Sans Allergenes",  // contenu du mail
        }

        const Pass = req.body.newPassword
        const confPass = req.body.confNewPassword
        // console.log(Pass + ' ' + confPass);

        let errorPass = false;
        let needAlertSend = false;

        if (Pass !== confPass) {
            //comparaison des mots de passe
            errorPass = true;
            console.log("mdp différent");
            res.render('user/resetPassword', {
                errorPass: errorPass,
                dbUserId: dbUserId,
                cookieGA: cookieGA,
                bandeauCookieGA: bandeauCookieGA,
                title: title,
                description: description
            })
        } else {
            needAlertSend = true;
            let isError;
            // console.log("mdp OK");
            const PassCrypt = bcrypt.hashSync(Pass, 12);

            userCollection.findByIdAndUpdate(
                { _id: user._id },
                {
                    password: PassCrypt,
                },
                (err, post) => {
                    if (err) {
                        isError = true;
                        console.log("ERREUR : " + err);
                        res.render('user/resetPassword', {
                            needAlertSend: needAlertSend,
                            isError: isError,
                            dbUserId: dbUserId,
                            cookieGA: cookieGA,
                            bandeauCookieGA: bandeauCookieGA,
                            title: title,
                            description: description
                        })
                    } else {
                        // Envoi mail confirmation changement mdp NODEMAILER     
                        transporter.sendMail(mailOptionsResetPass, (err, res, next) => { // utilisation de la constante transporter et de la fonction d'envoi de mail avec en paramètre les options mail prédéfini (afin de les envoyer dans le mail (ne le sont qu'au 1er clic))
                            if (err) {
                                isError = true;
                                console.error("ERREUR :" + err);
                                res.render("user/resetPassword", {
                                    needAlertSend: needAlertSend,
                                    isError: isError,
                                    dbUserId: dbUserId,
                                    cookieGA: cookieGA,
                                    bandeauCookieGA: bandeauCookieGA,
                                    title: title,
                                    description: description
                                })
                            } else {
                                console.log('Message envoyé');
                                next()
                            }
                        }),
                            isError = false;
                        // console.log(isError);
                        res.render('user/resetPassword', {
                            needAlertSend: needAlertSend,
                            isError: isError,
                            dbUserId: dbUserId,
                            cookieGA: cookieGA,
                            bandeauCookieGA: bandeauCookieGA,
                            title: title,
                            description: description
                        })
                    }
                })
        }
    }

}