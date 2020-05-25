const userCollection = require('../database/models/userModel');
const messageCollection = require('../database/models/messageModel');
const commentCollection = require('../database/models/commentModel');
const repertoryCollection = require('../database/models/repertoryModel');
const noteCollection = require('../database/models/noteModel');

const path = require('path');
// pour gestion suppression image
const fs = require('fs');
// pour gestion suppression image
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
        // définition des données d'authentification
        user: config.nodemailer.email,
        pass: config.nodemailer.password
    },
    tls: {
        rejectUnauthorized: false,  //définit des options TLSSocket node.js supplémentaires à transmettre au constructeur de socket
        // S'il n'est pas en "false", le serveur rejettera toute connexion non autorisée avec la liste des autorités de certification fournies
    }
})

let rand, mailOptions, host, link    //création de variable sans affectation (pour utilisation à suivre : dans postUserCreate)

module.exports = {

    /**************Création compte et envoi mail réinitialisation mot de passe*************/
    checkMail: async (req, res) => {
        const user = await userCollection.findOne({ email: req.body.email });
        let emailExist = false;

        if (user) {
            console.log('email déjà dans BDD');
            emailExist = true;
        }

        res.json({
            emailExist: emailExist,
        });
    },

    /**************Création compte et envoi mail réinitialisation mot de passe*************/
    postUserCreate: async (req, res) => {

        // Nodemailer config et affectation des constantes declarées plus haut
        rand = Math.floor((Math.random() * 100) + 62)   //créer un chiffre random qui servira d'ID
        host = req.get('host')  // adresse du site hébergeant l'envoi du mail de verif (req.get est une fonction avec en paramètre ici 'host' (vu par une console log de "req.get"))
        link = "http://" + req.get('host') + "/verifyMail/" + rand  // construction du lien (qui servira de lien de validation dans le mail) avec l'adresse du site et le chiffre random
        mailOptions = {
            from: config.nodemailer.email, // adresse du mail qui envoi le lien de verif
            to: req.body.email, // adresse de la personne à qui envoyer (celle de l'utilisateur qui s'inscrit)
            subject: 'Merci de confirmer votre adresse email', // sujet du mail de verif
            rand: rand, // nombre random généré à l'envoi du mail
            html: "Bonjour.<br> Merci de cliquer sur le lien ci-dessous pour vérifier votre adresse mail <br><a href=" + link + ">Cliquer ici pour vérifier votre email</a> <br>L'équipe Blog Sans Allergenes",  // contenu du mail
        }

        // console.log("link :" + link);   //donne : "http://localhost:5000/verifyMail/142" (ici 142 est l'un des chiffre random)
        // console.log("host :" + host);   //donne : "localhost:5000"
        // console.log("mailOptions.to : " + mailOptions.to);  //donne l'adresse mail renseigné lors de la création du compte

        //console.log(req.file);
        // console.log(req.body);
        const Pass = req.body.password
        const confPass = req.body.confPassword
        // console.log(Pass + ' ' + confPass);

        let gridCheck;
        // console.log(gridCheck);
        if (req.body.gridCheck == 'on') {
            gridCheck = true
        } else {
            gridCheck = false
        }
        // console.log(gridCheck);


        const user = await userCollection.findOne({ email: req.body.email })

        if (user) {
            // check si user déjà dans BDD
            // console.log(req.file);
            if (!req.file) {
                res.json({ message: "Cette email est déjà enregistré. Connectez-vous." });
            } else {
                const pathImage = path.resolve("public/ressources/images/" + req.file.filename)
                //console.log('email déjà dans BDD');
                fs.unlink(pathImage,
                    // suppression de l'image dans le cas où celle si sera envoyé et stockée dans la BDD sans création d'user malgré tout les contrôles
                    (err) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('img delete');
                        }
                    })
                //console.log("coucou");
                res.json({ message: "Cette email est déjà enregistré. Connectez-vous." });
            }
        } else if (Pass !== confPass) {
            //comparaison des mots de passe
            // console.log(req.file);
            if (!req.file) {
                res.json({ message: "Vos mots de passe sont différents. Veuillez rééssayer." });

            } else {
                const pathImage = path.resolve("public/ressources/images/" + req.file.filename)
                fs.unlink(pathImage,
                    // suppression de l'image dans le cas où celle si sera envoyé et stockée dans la BDD sans création d'user malgré tout les contrôles
                    (err) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('mdp différent');
                        }
                    })
                res.json({ message: "Vos mots de passe sont différents. Veuillez rééssayer." });
                //res.redirect('/')
            }
        } else if (!gridCheck) {
            //contrôle case conditions cochée
            // console.log(req.file);
            if (!req.file) {
                res.json({ message: "Vous n'avez pas accepté les conditions générales d'utilisations du site. Veuillez cocher la case." });
                // console.log("case non cochée");
            } else {
                const pathImage = path.resolve("public/ressources/images/" + req.file.filename)
                fs.unlink(pathImage,
                    // suppression de l'image dans le cas où celle si sera envoyé et stockée dans la BDD sans création d'user malgré tout les contrôles
                    (err) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('case non cochée');
                        }
                    })
                res.json({ message: "Vous n'avez pas accepté les conditions générales d'utilisations du site. Veuillez cocher la case." });
                console.log("case non cochée");
                //res.redirect('/')
            }
        } else {
            if (!req.file) {
                userCollection.create(
                    {
                        email: req.body.email,
                        // name : email : fourni dans le formData.append de la requête Ajax
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
                                // res.redirect('/')
                                res.json({
                                    noError: true,
                                    message: "Votre création de compte est réussie. Un email pour confirmer votre compte vous a été envoyé."
                                });
                            //res.json({ message: "Votre création de compte est réussie. Un email de confirmation de votre compte vient de vous être envoyé." });
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
                                // res.redirect('/')
                                res.json({
                                    noError: true,
                                    message: "Votre création de compte est réussie. Un email pour confirmer votre compte vous a été envoyé."
                                });
                            //res.json({ message: "Votre création de compte est réussie. Un email de confirmation de votre compte vous a été envoyé." });
                        }
                    })
            }
            //console.log(req.body);

        }
    },

    // *************Page de verification d'email***************
    getVerifyMail: async (req, res, next) => {
        // console.log("1");
        // console.log("mailOptions.to :" + mailOptions.to);

        const user = await userCollection.findOne({ email: mailOptions.to })  //recherche de l'utilisateur concerné par l'email (celui à qui on envoi et donc celui recup via req.body lors du post)

        // console.log("user._id :" + user._id);   //donne l'ID qui correspond à l'user lié à l'email
        // console.log("req.protocol : " + req.protocol);  //donne "http"
        // console.log(req.get('host'));


        if ((req.protocol + "://" + req.get('host')) == ("http://" + host)) {   //compare le lien utilisé pour venir sur la page (celui généré par le clic sur le lien dans le mail) et celui de notre site 
            console.log("Domain is matched. Information is from Authentic email")

            if (req.params.id == mailOptions.rand) {    //récupère dans l'url l'id (qui est censé être le numéro random généré pour le lien dans le mail) et le compare au même randon généré dans les options de l'envoi du mail
                console.log("Rand is matched. Information is from Authentic email")

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
                            res.send(err)
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
    getConfirmVerifyMail: async (req, res) => {
        const title = meta.confirmVerifyMail.title;
        const description = meta.confirmVerifyMail.description;

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

        res.render('user/confirmVerifyMail', {
            dbUserId: dbUserId,
            cookieGA: cookieGA,
            bandeauCookieGA: bandeauCookieGA,
            title: title,
            description: description
        })
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

    /**************Suppression compte par utilisateur : modification des statuts user : notamment en isDelete : true***************/
    putUserEditDelete: async (req, res) => {
        // console.log(req.params.id);

        const isDelete = true;
        const typeDefault = false;
        const deleteDate = new Date()

        userCollection.findOneAndUpdate(
            { _id: req.params.id },
            {
                fonction: "Utilisateur supprimé",
                isDelete: isDelete,
                isAdmin: typeDefault,
                isVerified: typeDefault,
                isBan: typeDefault,
                deleteDate: deleteDate
            },
            { multi: true },
            (err) => {
                if (!err) {
                    console.log("User status delete");
                    req.session.destroy(() => {
                        res.clearCookie('clear cookie OK et déco ok');
                        res.redirect('/')
                    })
                    commentCollection.updateMany(
                        { authorId: req.params.id },
                        {
                            authorId: null
                        },
                        { multi: true },
                        (err) => {
                            if (!err) {
                                console.log("update authorId comment ok");
                            } else {
                                res.rend(err)
                            }
                        }
                    )
                    messageCollection.updateMany(
                        { authorId: req.params.id },
                        {
                            authorId: null
                        },
                        { multi: true },
                        (err) => {
                            if (!err) {
                                console.log("update authorId message ok");
                            } else {
                                res.rend(err)
                            }
                        }
                    )
                    noteCollection.updateMany(
                        { authorId: req.params.id },
                        {
                            authorId: null
                        },
                        { multi: true },
                        (err) => {
                            if (!err) {
                                console.log("update authorId note ok");
                            } else {
                                res.rend(err)
                            }
                        }
                    )
                    repertoryCollection.updateMany(
                        { authorId: req.params.id },
                        {
                            authorId: null
                        },
                        { multi: true },
                        (err) => {
                            if (!err) {
                                console.log("update authorId repertory ok");
                            } else {
                                res.rend(err)
                            }
                        }
                    )
                } else {
                    console.log(err);
                }
            })

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
            res.json({ message: "Email ou mot de passe incorrect." }).status(401);
            // res.redirect('/')
        } else if (dbUser.isBan) {
            console.log('user banni');
            res.json({ message: "Votre compte a été banni car vous n'avez pas respecté l'une des conditions générales d'utilisation du site." }).status(401);
            // res.redirect('/')
        } else if (dbUser.isDelete) {
            console.log('user delete');
            res.json({ message: "Ce compte est supprimé. Veuillez créer un nouveau compte." }).status(401);
            // res.redirect('/')
        } else {
            const sess = req.session
            // console.log(req.body)
            // console.log(sess);

            bcrypt.compare(password, dbUser.password, (err, same) => {
                if (!same) {
                    console.log('mdp non correct');
                    res.json({ message: "Email ou mot de passe incorrect." }).status(401);
                    // res.redirect('back')
                } else {
                    sess.userId = dbUser._id
                    sess.status = dbUser.status
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


    // /**************Suppression compte***************/
    // deleteOneUser: async (req, res) => {
    //     // console.log(req.params.id);
    //     const dbUser = await userCollection.findById(req.params.id);
    //     const pathImage = path.resolve("public/ressources/images/" + dbUser.nameImage)
    //     // console.log(dbUser);
    //     // console.log(dbUser.nameImage);


    //     if (dbUser.nameImage == null) {
    //         // mettre undefined plutôt ??
    //         console.log("pas d'image");
    //         userCollection.deleteOne(
    //             { _id: req.params.id },
    //             (err) => {
    //                 if (!err) {
    //                     console.log("User delete");
    //                     req.session.destroy(() => {
    //                         res.clearCookie('clear cookie OK et déco ok');
    //                         res.redirect('/')
    //                     })
    //                     // res.redirect('/')
    //                     // res.render('home')
    //                 } else {
    //                     console.log(err);
    //                 }
    //             })
    //     } else {
    //         userCollection.deleteOne(
    //             { _id: req.params.id },
    //             (err) => {
    //                 if (!err) {
    //                     fs.unlink(pathImage,
    //                         (err) => {
    //                             if (err) {
    //                                 console.log(err);
    //                             } else {
    //                                 console.log("User and File delete et déco ok");
    //                                 req.session.destroy(() => {
    //                                     res.clearCookie('clear cookie OK');
    //                                     res.redirect('/')
    //                                 })
    //                                 // res.redirect('/')
    //                                 // res.render('home')
    //                             }
    //                         }
    //                     )
    //                 } else {
    //                     res.send(err)
    //                 }
    //             })
    //     }

    // },
    // // ATTENTION bien penser à mettre un form method POST et en action l'url puis "/?_method=delete" avec autour du bouton qui est en type submit

}
