const { firebase } = require('./firebase');
const { createRoom } = require('./createRoom');
const db = firebase.database();

function checkRoom(name, res, roomId) {
    //checks if room ID exists
    console.log('checkRoom')
    db.ref('rooms').child(roomId).get().then( snapshot => {
        if (snapshot.exists()){
            createRoom(name, roomId);
        } 
        else {
        };
    });
};

module.exports = { checkRoom };