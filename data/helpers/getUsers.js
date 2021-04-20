const { firebase } = require('./firebase');
const db = firebase.database();

function getUsers(roomId) {
    db.ref('rooms').child(roomId).child('players').get().then( snapshot => {
        if (snapshot.exists()){
            console.log(snapshot.val())
        } else {
        };
    });
};

module.exports = { getUsers };