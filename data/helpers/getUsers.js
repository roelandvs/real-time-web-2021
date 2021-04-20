const { firebase } = require('./firebase');
const db = firebase.database();

function getUsers(roomId, property) {
    return db.ref('rooms').child(roomId).child('players').get().then( snapshot => {
        if (snapshot.exists()){
            playerValues = [];
            snapshot.forEach(player => {
                playerValues.push(player.val()[property]);
            })
            return playerValues;
        } else {
        };
    });
};

module.exports = { getUsers };