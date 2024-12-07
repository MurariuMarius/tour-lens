const admin = require("firebase-admin");
const serviceAccount = require("./tour-lens-firebase-adminsdk.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
 
const firestoreService = admin.firestore();

module.exports = {
    firestoreService
};