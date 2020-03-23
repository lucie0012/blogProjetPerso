const userCollection = require('../database/models/userModel');
const path = require('path');
// pour gestion suppression image
const fs = require('fs')
// pour gestion suppression image
const bcrypt = require('bcrypt')
// pour compare password chiffré
const nodemailer = require('nodemailer')
// pour utiliser nodemailer


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
        user: "blogSansAllergenes@gmail.com",
        pass: "blog1234"
    },
    tls: {
        rejectUnauthorized: false,  //définit des options TLSSocket node.js supplémentaires à transmettre au constructeur de socket
        // S'il n'est pas en "false", le serveur rejettera toute connexion non autorisée avec la liste des autorités de certification fournies
    }
})

let rand, mailOptions, host, link    //création de variable sans affectation (pour utilisation à suivre)
let randForgotPass, mailOptionsForgotPass, hostForgotPass, linkForgotPass   //création de variable sans affectation (pour utilisation à suivre)


module.exports = {

    /**************Création compte et envoi mail réinitialisation mot de passe*************/
    postUserCreate: (req, res) => {

        // Nodemailer config et affectation des constantes declarées plus haut
        rand = Math.floor((Math.random() * 100) + 62)   //créer un chiffre random qui servira d'ID
        host = req.get('host')  // adresse du site hébergeant l'envoi du mail de verif (req.get est une fonction avec en paramètre ici 'host' (vu par une console log de "req.get"))
        link = "http://" + req.get('host') + "/verifyMail/" + rand  // construction du lien (qui servira de lien de validation dans le mail) avec l'adresse du site et le chiffre random
        mailOptions = {
            from: 'blogSansAllergenes@gmail.com', // adresse du mail qui envoi le lien de verif
            to: req.body.email, // adresse de la personne à qui envoyer (celle de l'utilisateur qui s'inscrit)
            subject: 'Merci de confirmer votre adresse email', // sujet du mail de verif
            rand: rand, // nombre random généré à l'envoi du mail
            html: "Bonjour.<br> Merci de cliquer sur le lien ci-dessous pour vérifier votre adresse mail <br><a href=" + link + ">Cliquer ici pour vérifier votre email</a> <br>L'équipe Blog Sans Allergenes",  // contenu du mail
        }

        // console.log("link :" + link);   //donne : "http://localhost:5000/verifyMail/142" (ici 142 est l'un des chiffre random)
        // console.log("host :" + host);   //donne : "localhost:5000"
        // console.log("mailOptions.to : " + mailOptions.to);  //donne l'adresse mail renseigné lors de la création du compte


        // console.log(req.body);
        const Pass = req.body.password
        const confPass = req.body.confPassword
        // console.log(Pass + ' ' + confPass);

        if (Pass !== confPass) {
            //comparaison des mots de passe
            res.redirect('/')
            // res.render('user/userCreate')
        } else {
            if (!req.file) {
                userCollection.create(
                    {
                        email: req.body.email,
                        name: req.body.name,
                        pseudo: req.body.pseudo,
                        password: Pass,
                    },
                    (err, post) => {
                        if (err) {
                            res.send(err)
                        } else {
                            // Envoi mail validation NODEMAILER     
                            transporter.sendMail(mailOptions, (err, res, next) => { // utilisation de la constante transporter et de la fonction d'envoi de mail avec en paramètre les options mail prédéfini (afin de les envoyer dans le mail (ne le sont qu'au 1er clic))
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
                    })

            } else {
                userCollection.create(
                    {
                        email: req.body.email,
                        name: req.body.name,
                        pseudo: req.body.pseudo,
                        password: Pass,
                        image: `/public/ressources/images/${req.file.filename}`,
                        nameImage: req.file.filename,
                    },
                    (err, post) => {
                        if (err) {
                            res.send(err)
                        } else {
                            // Envoi mail validation NODEMAILER     
                            transporter.sendMail(mailOptions, (err, res, next) => { // utilisation de la constante transporter et de la fonction d'envoi de mail avec en paramètre les options mail prédéfini
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
                    })
            }
        }
    },

    // *************Page de verification d'email***************
    getVerifyMail: async (req, res, next) => {
        // console.log("1");
        // console.log("mailOptions.to :" + mailOptions.to);

        const user = await userCollection.findOne({ email: mailOptions.to })  //recherche de l'utilisateur concerné par l'email (celui à qui on envoi et donc celui recup via req.body lors du post)

        // console.log("user._id :" + user._id);   //donne l'ID qui correspond à l'user lié à l'email
        // console.log("req.protocol : " + req.protocol);  //donne "http"


        if ((req.protocol + "://" + req.get('host')) == ("http://" + host)) {   //compare le lien utilisé pour venir sur la page (celui généré par le clic sur le lien dans le mail) et celui de notre site 
            console.log("Domain is matched. Information is from Authentic email")

            if (req.params.id == mailOptions.rand) {    //récupère dans l'url l'id (qui est censé être le numéro random généré pour le lien dans le mail) et le compare au même randon généré dans les options de l'envoi du mail

                userCollection.findByIdAndUpdate( // modifie l'info isVerified de l'utilisateur 
                    { _id: user._id },
                    {
                        isVerified: true,
                        fonction: "Vérifié",
                    },
                    (err) => {
                        if (!err) {
                            res.redirect('/verifyMail')
                        } else {
                            res.rend(err)
                        }
                    }
                )
            } else {
                res.send(" Bad Request")
            }
        } else {
            res.send('Request is from unknow source')
        }

    },

    // *************Affichage page confirmation vérification mail***************
    getConfirmVerifyMail: (req, res) => {
        res.render('user/confirmVerifyMail')
    },


    /**************Edition compte***************/
    putUserEdit: async (req, res) => {
        // console.log(req.params.id);
        const dbUser = await userCollection.findById(req.params.id);
        const pathImage = path.resolve("public/ressources/images/" + dbUser.nameImage)
        // console.log(req.file);
        // console.log(dbUser.nameImage);

        if (!req.file) {
            if (req.body) {
                // console.log(req.body);
                userCollection.findOneAndUpdate(
                    { _id: req.params.id },
                    {
                        email: req.body.email,
                        pseudo: req.body.pseudo,
                        name: req.body.name,
                    },
                    { multi: true },
                    (err) => {
                        if (err) {
                            res.redirect("/")
                        } else {
                            console.log('UPDATE OK');
                            res.redirect('/')
                        }
                    })
            } else {
                res.redirect("/")
                console.log('no req.body');
            }
        } else if (dbUser.nameImage == null) {
            userCollection.findOneAndUpdate(
                { _id: req.params.id },
                {
                    email: req.body.email,
                    pseudo: req.body.pseudo,
                    name: req.body.name,
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
                        res.redirect('/')
                    }
                })
        } else {
            userCollection.findOneAndUpdate(
                { _id: req.params.id },
                {
                    email: req.body.email,
                    pseudo: req.body.pseudo,
                    name: req.body.name,
                    image: `/public/ressources/images/${req.file.filename}`,
                    nameImage: req.file.filename,
                },
                { multi: true },
                (err, post) => {
                    fs.unlink(pathImage,
                        (err) => {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log('New img OK and old File delete');
                                res.redirect('/')
                            }
                        })
                })
        }
    },

    /**************Suppression compte***************/
    deleteOneUser: async (req, res) => {
        // console.log(req.params.id);
        const dbUser = await userCollection.findById(req.params.id);
        const pathImage = path.resolve("public/ressources/images/" + dbUser.nameImage)
        // console.log(dbUser);
        // console.log(dbUser.nameImage);


        if (dbUser.nameImage == null) {
            // mettre undefined plutôt ??
            console.log("pas d'image");
            userCollection.deleteOne(
                { _id: req.params.id },
                (err) => {
                    if (!err) {
                        console.log("User delete");
                        req.session.destroy(() => {
                            res.clearCookie('clear cookie OK et déco ok');
                            res.redirect('/')
                        })
                        // res.redirect('/')
                        // res.render('home')
                    } else {
                        console.log(err);
                    }
                })
        } else {
            userCollection.deleteOne(
                { _id: req.params.id },
                (err) => {
                    if (!err) {
                        fs.unlink(pathImage,
                            (err) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log("User and File delete et déco ok");
                                    req.session.destroy(() => {
                                        res.clearCookie('clear cookie OK');
                                        res.redirect('/')
                                    })
                                    // res.redirect('/')
                                    // res.render('home')
                                }
                            }
                        )
                    } else {
                        res.send(err)
                    }
                })
        }

    },
    // ATTENTION bien penser à mettre un form method POST et en action l'url puis "/?_method=delete" avec autour du bouton qui est en type submit

    /**************Connexion***************/
    postUserAuth: async (req, res) => {
        const { email, password } = req.body
        // comme si on faisait const email = req.body. email et const password = req.body.password
        const dbUser = await userCollection.findOne({ email })

        // console.log("test");
        // console.log(req.body.email);

        if (!dbUser) {
            console.log('user pas dans la DB');
            res.json({ message: "Email ou mot de passe incorrect." });
            // res.redirect('/')
        } else {
            const sess = req.session
            // console.log(req.body)
            // console.log(sess);

            bcrypt.compare(password, dbUser.password, (err, same) => {
                if (!same) {
                    console.log('mdp non correct');
                    res.json({ message: "Email ou mot de passe incorrect." });
                    // res.redirect('back')
                } else {
                    sess.userId = dbUser._id
                    sess.status = dbUser.status
                    sess.name = dbUser.name
                    sess.pseudo = dbUser.pseudo
                    sess.email = dbUser.email
                    sess.fonction = dbUser.fonction
                    sess.isVerified = dbUser.isVerified
                    sess.isAdmin = dbUser.isAdmin
                    sess.isModo = dbUser.isModo
                    sess.isBan = dbUser.isBan
                    // console.log(sess);
                    // res.redirect('/')
                    res.json({ noError: true });
                }
            })
        }
    },

    /**************Déconnexion***************/
    getLogOut: (req, res, next) => {
        req.session.destroy(() => {
            res.clearCookie('clear cookie OK');
            res.redirect('/')
        })
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
                fonction: "Vérifié",
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
            // "role" est le name du "select" dans la page admin
            userCollection.findOneAndUpdate(
                { _id: req.params.id },
                {
                    fonction: "Administrateur",
                    isVerified: true,
                    isAdmin: true,
                    isBan: false
                },
                { multi: true },
                (err) => {
                    if (!err) {
                        res.redirect('/admin')
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
                    isAdmin: false,
                    isBan: false
                },
                { multi: true },
                (err) => {
                    if (!err) {
                        res.redirect('/admin')
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
                    isAdmin: false,
                    isBan: true
                },
                { multi: true },
                (err) => {
                    if (!err) {
                        res.redirect('/admin')
                    } else {
                        res.rend(err)
                    }
                }
            )
        }
    },

    /**************Suppression utilisateur pour admin***************/
    deleteOneUserAdmin: async (req, res) => {

        // console.log(req.params.id);
        const dbUser = await userCollection.findById(req.params.id);
        const pathImage = path.resolve("public/ressources/images/" + dbUser.nameImage)
        // console.log(dbUser);
        // console.log(dbUser.nameImage);

        if (dbUser.nameImage == null) {
            // mettre undefined plutôt ??
            console.log("pas d'image");
            userCollection.deleteOne(
                { _id: req.params.id },
                (err) => {
                    if (!err) {
                        console.log("User delete");
                        res.redirect('/admin')
                        // res.render('admin')
                    } else {
                        console.log(err);
                    }
                })
        } else {
            userCollection.deleteOne(
                { _id: req.params.id },
                (err) => {
                    if (!err) {
                        fs.unlink(pathImage,
                            (err) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log("User and File delete");
                                    res.redirect('/admin')
                                    // res.render('admin')
                                }
                            }
                        )
                    } else {
                        res.send(err)
                    }
                })
        }
    },


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

        console.log("link :" + linkForgotPass);   //donne : "http://localhost:5000/verifyMail/142" (ici 142 est l'un des chiffre random)
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
        // ajouter autre chose ?? / récupérer

        console.log("1 get");
        console.log("mailOptionsForgotPass.to :" + mailOptionsForgotPass.to);

        const user = await userCollection.findOne({ email: mailOptionsForgotPass.to })  //recherche de l'utilisateur concerné par l'email (celui à qui on envoi et donc celui recup via req.body lors du post)

        console.log("user :" + user);

        res.render('user/resetPassword', { user })
    },

    /**************Création nouveau mot de passe***************/
    postResetPassword: async (req, res) => {

        console.log(req.body);

        console.log("2 post");
        console.log("ID : " + req.params.id)

        const user = await userCollection.findById(req.params.id)  //recherche de l'utilisateur concerné par l'email (celui à qui on envoi et donc celui recup via req.body lors du post)

        console.log("user" + user);
        console.log("req.protocol : " + req.protocol);  //donne "http"

        res.redirect('/')
        // res.render('user/resetPassword') avec une variable et un message comme page contact ?
    },
}
