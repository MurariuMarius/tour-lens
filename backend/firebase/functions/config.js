const admin = require("firebase-admin");
const serviceAccount = require("./tour-lens-firebase-adminsdk.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
 
const firestoreService = admin.firestore();
const bucket = admin.storage().bucket("tour-lens.firebasestorage.app");

module.exports = {
    firestoreService,
    bucket
};