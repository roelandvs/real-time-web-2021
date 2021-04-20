const { firebase } = require('./firebase');
const { createRoom } = require('./createRoom');
const db = firebase.database();

function checkRoom(name, res, roomId) {
    //checks if room ID exists
    db.ref('rooms').child(roomId).get().then( snapshot => {
        if (snapshot.exists()){
            createRoom(name, res, roomId);
        } 
        else {
        };
    });
};

module.exports = { checkRoom };