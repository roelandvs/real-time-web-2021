const { firebase } = require('./firebase');
const db = firebase.database();

function getData(roomId, property) {
    const userRef = db.ref('rooms').child(roomId);

    return userRef.child('players').get().then( snapshot => {
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

module.exports = { getData };