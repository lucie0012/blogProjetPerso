// // const assert = require('assert');
// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// const expect = require('chai').expect;
// const userCollection = require('../api/database/models/userModel');

// const userData = { name: 'Testy', pseudo: 'testy', email: 'testy@test.fr', password: 'test' };

// describe("Test USER : CREATE", () => {

//     beforeEach(async () => {
//     // exécution à faire avant chaque test (ici avant chaque it)
//         // console.log("Suppression des collections (ici user) avant le debut de chaque it");
//         await userCollection.deleteMany({})
//     });

//     it("Créer un utilisateur : succès ", async () => {
//         const validUser = new userCollection(userData);
//         const savedUser = await validUser.save()
//         // const savedUser = await userCollection.create(userData)
//             // autre moyen de faire la création (remplace la ligne const savedUser)

//         expect(savedUser._id).to.have.property('id');
//         expect(savedUser.name).to.be.equal(userData.name);
//         expect(savedUser.pseudo).to.be.equal(userData.pseudo);
//         expect(savedUser.email).to.be.equal(userData.email);
//     });

//     it("Créer un utilisateur : contrôler 'default' ", async () => {
//         const validUser = new userCollection(userData);
//         const savedUser = await validUser.save()

//         expect(savedUser.status).to.be.equal('user');
//         expect(savedUser.fonction).to.be.equal('Utilisateur');
//         expect(savedUser.isVerified).to.be.equal(false);
//         expect(savedUser.isAdmin).to.be.equal(false);
//         expect(savedUser.isBan).to.be.equal(false);
//         expect(savedUser.isDelete).to.be.equal(false);
//     });

//     it("Créer un utilisateur : contrôler 'default date' ", async () => {
//         const validUser = new userCollection(userData);
//         const savedUser = await validUser.save()

//         expect(savedUser.createDate).to.be.an('date')
//     });

//     it("Créer un utilisateur : non réussi : 'champs requis' ", async () => {
//         const userWithoutPseudo = new userCollection({ name: 'Testy', email: 'testy@test.fr', password: 'test' });

//         let err = undefined;
//         try {
//             await userWithoutPseudo.save();
//         } catch (error) {
//             err = error
//         }

//         expect(err).to.be.not.equal(undefined);
//         expect(err).to.be.an.instanceof(mongoose.Error.ValidationError);
//     });

//     it("Créer un utilisateur : non réussi : 'email unique' ", async () => {

//         const validUser = new userCollection(userData);
//         const savedUser = await validUser.save()

//         const validUserDuplicate = new userCollection({ name: 'Testy2', pseudo: 'testy2', email: 'testy@test.fr', password: 'test2' });

//         let err = undefined;
//         try {
            
//             await validUserDuplicate.save()
//         } catch (error) {
//             err = error
//             // console.log("erreur à suivre")
//             // console.log(err)
//         }

//         expect(err).to.be.not.equal(undefined);
//         expect(err.code).to.be.equal(11000);

//     });

//     it("Créer un utilisateur : contrôle comparaison chiffrage password ", async () => {
//         const validUser = new userCollection(userData);
//         const savedUser = await validUser.save()

//         bcrypt.compare(userData.password, savedUser.password, (err, result) => {
//             const same = result

//             expect(same).to.be.equal(true);
//         });

//     });

// });
