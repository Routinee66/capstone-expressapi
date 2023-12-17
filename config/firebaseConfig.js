// config/firebaseConfig.js
const admin = require('firebase-admin');
const serviceAccount = require('../credentials/serviceAccountKey.json'); // Sesuaikan dengan lokasi file Anda

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://baskaryaapp-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const firestore = admin.firestore();

module.exports = { admin, firestore };
