const fb = require('firebase/app')
require('firebase/database')

const firebaseConfig = {
    apiKey: "AIzaSyDE1QCEoiSWLvSd0Vn8EAo1HTl_XmsvIh0",
    authDomain: "realtime-poker-app.firebaseapp.com",
    databaseURL: "https://realtime-poker-app-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "realtime-poker-app",
    storageBucket: "realtime-poker-app.appspot.com",
    messagingSenderId: "445996789142",
    appId: "1:445996789142:web:30eed93da27254c37f41b7"
};

//Checks if connection to FB exists
const firebase = !fb.apps.length ? fb.initializeApp(firebaseConfig) : fb.app()

module.exports = { firebase }