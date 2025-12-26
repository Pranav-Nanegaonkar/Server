// Firebase configuration
// Configure your Firebase admin SDK here

const admin = require('firebase-admin');

// Initialize Firebase if needed
// const serviceAccount = require('./serviceAccountKey.json');
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: 'your-database-url'
// });

module.exports = admin;
