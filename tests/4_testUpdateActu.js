// const assert = require('assert');
// const actuCollection = require('../api/database/models/actuModel');

// describe('CRUD 3 article : UPDATE', () => {

//     let actu;

//     beforeEach(async () => {
//     // exécution à faire avant chaque test (ici avant chaque it)
//         // console.log("Suppression des collections (ici actu) avant le debut de chaque it");
//         await actuCollection.deleteMany({})
//     });

//     //à faire avant chaque it
//     beforeEach((done) => {
//         actu = new actuCollection({
//             title: 'test',
//             content: "test",
//         });
//         actu.save()
//             .then(() => done());
//     });

//     // création de la fonction "assertHelper" qui effectuera l'assertion pour chaque test (it) (assertion : permet de tester qu'une valeur correspond bien à ce que l'on attend))
//     function assertHelper(statement, done) {
//         statement
//         // statement : est remplacé à chaque test (it) par le 1er paramètre (par exemple pour le 1er : actu.save s'exécute puis (then) le reste s'éxécute)
//             .then(() => actuCollection.find({}))
//             .then((actus) => {
//                 // actus est le résultat de actuCollection.findOne({ title: 'test' })
//                 assert(actus.length === 1);
//                 assert(actus[0].title === 'Test2');
//                 done();
//             });
//     }

//     it("Définir et enregistrer l'article à l'aide d'une instance", (done) => {
//         actu.set('title', 'Test2');
//         //modifie la valeur de "title" en "Test2" via .set / pas encore mis à jour dans mongodb
//         assertHelper(actu.save(), done);
//         // met à jour (sauvegarde) dans la BDD (via .save) : ici actu.save() remplace le "statement" de notre fonction assertHelper
//     });

//     it("Mettre à jour l'article en utilisant l'instance", (done) => {
//         //utle pour mettre à jour plusieurs champs de l'objet
//         assertHelper(actu.updateOne({ title: 'Test2' }), done);
//     });

//     it("Mettre à jour tout les articles correspondants en utilisant le modèle", (done) => {
//         assertHelper(actuCollection.updateMany({ title: 'test' }, { title: 'Test2' }), done);
//     });

//     it("Mettre à jour un article en utilisant le modèle", (done) => {
//         assertHelper(actuCollection.findOneAndUpdate({ title: 'test' }, { title: 'Test2' }), done);
//     });

//     it("Mettre à jour un article selon l'Id en utilisant le modèle", (done) => {
//         assertHelper(actuCollection.findByIdAndUpdate(actu._id, { title: 'Test2' }), done);
//     });

// });