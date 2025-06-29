const admin = require('firebase-admin');
const path = require('path');

// Initialize with service account file
admin.initializeApp({
  credential: admin.credential.cert(require(path.resolve(__dirname, '../service-account.json')))
});

module.exports = admin;
