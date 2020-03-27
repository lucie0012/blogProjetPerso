const userCollection = require('../database/models/userModel');
const bcrypt = require('bcrypt');
// pour compare password chiffré
const nodemailer = require('nodemailer');
// pour utiliser nodemailer

const config = require('../config/config');
// import fichier config pour mail/mdp nodemailer


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
        pass: config.nodemailer.password
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
    getForgotPassword: (req, res) => {
        res.render('user/forgotPassword')
    },


    /**************Envoi mail réinitialisation mot de passe***************/
    postForgotPassword: async (req, res) => {
        // Nodemailer config et affectation des constantes declarées plus haut
        randForgotPass = Math.floor((Math.random() * 100) + 53)   //créer un chiffre random qui servira d'ID
        hostForgotPass = req.get('host')  // adresse du site hébergeant l'envoi du mail de verif (req.get est une fonction avec en paramètre ici 'host' (vu par une console log de "req.get"))
        linkForgotPass = "http://" + req.get('host') + "/resetPassword/" + randForgotPass  // construction du lien (qui servira de lien de validation dans le mail) avec l'adresse du site et le chiffre random
        mailOptionsForgotPass = {
            from: 'blogSansAllergenes@gmail.com', // adresse du mail qui envoi le lien de verif
            to: req.body.email, // adresse de la personne à qui envoyer (celle de l'utilisateur qui s'inscrit)
            subject: 'Votre demande de réinitialisation de mot de passe', // sujet du mail de verif
            randForgotPass: randForgotPass, // nombre random généré à l'envoi du mail
            html: "Bonjour.<br> Merci de cliquer sur le lien ci-dessous pour réinitialiser votre mot de passe <br><a href=" + linkForgotPass + ">Cliquer ici pour le réinitialiser</a> <br>L'équipe Blog Sans Allergenes",  // contenu du mail
        }

        // console.log("link :" + linkForgotPass);   //donne : "http://localhost:5000/resetPassword/142" (ici 142 est l'un des chiffre random)
        // console.log("host :" + hostForgotPass);   //donne : "localhost:5000"
        // console.log("mailOptions.to : " + mailOptionsForgotPass.to);  //donne l'adresse mail renseigné lors de la création du compte

        const email = req.body.email
        // console.log(req.body.email)

        const user = await userCollection.findOne({ email })
        // console.log(user);

        if (!user) {
            console.log('user pas dans la DB');
            // res.json({ message: "Vous n'avez pas de compte." });
            res.redirect('/')
            // faire un res.render avec le retour d'une variable pour afficher le message (comme dans contact)
        } else {
            transporter.sendMail(mailOptionsForgotPass, (err, res, next) => { // utilisation de la constante transporter et de la fonction d'envoi de mail avec en paramètre les options mail prédéfini (afin de les envoyer dans le mail (ne le sont qu'au 1er clic))
                if (err) {
                    console.error("ERREUR :" + err);
                    res.render("error")
                } else {
                    console.log('Message envoyé');
                    next()
                }
            }),
                res.redirect('/')
        }
        // res.redirect('/')
    },


    /**************Affichage page création nouveau mot de passe suite lien***************/
    getResetPassword: async (req, res) => {

        // console.log("1 get");
        // console.log("mailOptionsForgotPass.to :" + mailOptionsForgotPass.to);
        // console.log(req.get('host'));
        // console.log("ID : " + req.params.id)
        // console.log("RAND : " + mailOptionsForgotPass.randForgotPass);

        const user = await userCollection.findOne({ email: mailOptionsForgotPass.to })  //recherche de l'utilisateur concerné par l'email (celui à qui on envoi et donc celui recup via req.body lors du post)
        // console.log("user :" + user);

        if ((req.protocol + "://" + req.get('host')) == ("http://" + hostForgotPass)) {   //compare le lien utilisé pour venir sur la page (celui généré par le clic sur le lien dans le mail) et celui de notre site 
            console.log("Domain is matched. Information is from Authentic email")

            if (req.params.id == mailOptionsForgotPass.randForgotPass) {    //récupère dans l'url l'id (qui est censé être le numéro random généré pour le lien dans le mail) et le compare au même randon généré dans les options de l'envoi du mail
                console.log("Rand is matched. Information is from Authentic email")

                res.render('user/resetPassword', { user })
                // renvoi des données user sur la page afin de pouvoir y récupérer l'id dans l'url afin de pouvoir cibler l'user (via req.params.id) et submit sur le bon user

            } else {
                res.send("Bad Request")
            }
        } else {
            res.send('Request is from unknow source')
        }

    },

    /**************Création nouveau mot de passe***************/
    postResetPassword: async (req, res) => {
        // console.log("2 post");
        // console.log(req.body);
        // console.log("ID : " + req.params.id)

        const user = await userCollection.findById(req.params.id)  //recherche de l'utilisateur concerné par l'email (celui à qui on envoi et donc celui recup via req.body lors du post)
        // console.log("user" + user);

        // Nodemailer config et affectation des constantes declarées plus haut
        linkResetPass = "http://" + req.get('host')
        mailOptionsResetPass = {
            from: 'blogSansAllergenes@gmail.com', // adresse du mail qui envoi le lien de verif
            to: user.email, // adresse de la personne à qui envoyer (celle de l'utilisateur qui s'inscrit)
            subject: 'Confirmation de réinitialisation de mot de passe', // sujet du mail de verif
            html: "Bonjour.<br> Votre mot de passe a bien été réinitialisé.<br><a href=" + linkResetPass + ">Revenir sur le site et se connecter</a> <br>L'équipe Blog Sans Allergenes",  // contenu du mail
        }

        const Pass = req.body.newPassword
        const confPass = req.body.confNewPassword
        // console.log(Pass + ' ' + confPass);

        if (Pass !== confPass) {
        //comparaison des mots de passe
            // console.log("mdp différent");
            res.render('user/resetPassword')
            // AFFICHER MESSAGE COMME CONTACT
        } else {
            // console.log("mdp OK");
            const PassCrypt = bcrypt.hashSync(Pass, 12);

            userCollection.findByIdAndUpdate(
                { _id: user._id },
                {
                    password: PassCrypt,
                },
                (err, post) => {
                    if (err) {
                        console.log("ERREUR : " + err);
                        res.render('user/resetPassword')
                        // ET METTRE MESSAGE TYPE PAGE CONTACT
                    } else {
                        // Envoi mail confirmation changement mdp NODEMAILER     
                        transporter.sendMail(mailOptionsResetPass, (err, res, next) => { // utilisation de la constante transporter et de la fonction d'envoi de mail avec en paramètre les options mail prédéfini (afin de les envoyer dans le mail (ne le sont qu'au 1er clic))
                            if (err) {
                                console.error("ERREUR :" + err);
                                res.render("error")
                            } else {
                                console.log('Message envoyé');
                                next()
                            }
                        }),
                            res.render('user/resetPassword')
                        // ET METTRE MESSAGE TYPE PAGE CONTACT (disant OK mail vous est envoyé, retour page accueil pour vous connecter)
                    }
                })
        }
    }

}