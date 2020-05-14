// const assert = require('assert');
// const actuCollection = require('../api/database/models/actuModel');

// describe('CRUD 4 article : DELETE', () => {

//     let actu;

//     beforeEach(async () => {
//     // exécution à faire avant chaque test (ici avant chaque it)
//         // console.log("Suppression des collections (ici actu) avant le debut de chaque it");
//         await actuCollection.deleteMany({})
//     });

//     beforeEach((done) => {

//         // console.log("beforeEach CRUD 4");
        
//         actu = new actuCollection({
//             title: 'test',
//             content: "test",
//         });
//         actu.save()
//             .then(() => {
//                 // console.log("actu save CRUD 3 avant done");
//                 done();
//                 // console.log("actu save CRUD 3 apres done");
//             });
//     });

//     it("DELETE : Supprimer un article en utilisant son instance", (done) => {
//         actu.deleteOne()
//             .then(() => actuCollection.findOne({ title: 'test' }))
//             .then((actu) => {
//             // actu est le résultat de actuCollection.findOne({ title: 'test' })
//                 assert(actu === null);
//                 done();
//                 // console.log("actu delete CRUD 3 apres done");
//             });
//     });

//     it('DELETE : Supprimer plusieurs articles', (done) => {
//         actuCollection.deleteMany({ title: 'test' })
//             .then(() => actuCollection.findOne({ title: 'test' }))
//             .then((actu) => {
//                 assert(actu === null);
//                 done();
//             });
//     });

//     it("DELETE : Supprimer un article", (done) => {
//         actuCollection.findOneAndRemove({ title: 'test' })
//             .then(() => actuCollection.findOne({ title: 'test' }))
//             .then((actu) => {
//                 assert(actu === null);
//                 done();
//             });
//     });

//     it("DELETE : Supprimer un article en utilisant l'id", (done) => {
//         actuCollection.findByIdAndRemove(actu._id)
//             // the following code block is repeated again and again
//             .then(() => actuCollection.findOne({ title: 'test' }))
//             .then((actu) => {
//                 assert(actu === null);
//                 done();
//             });
//     })
// })