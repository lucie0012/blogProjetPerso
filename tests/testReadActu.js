// const assert = require('assert');
// const actuCollection = require('../api/database/models/actuModel');

// describe("CRUD 2 article : READ", () => {

//     let actu;

//     beforeEach((done) => {
//         actu = new actuCollection({
//             title: "test",
//             content: "test",
//         });
//         actu.save()
//             .then(() => {
//                 // console.log("actu save CRUD 2 avant done");
//                 done();
//                 // console.log("actu save CRUD 2 apres done");
//             });
//     });


//     it("READ : Lire un article avec le titre 'test'", (done) => {
//         actuCollection.findOne({ title: "test" })
//             .then((actu) => {
//                 assert(actu.title === "test" && actu.content === "test");
//                 done();
//             });
//     });
// });